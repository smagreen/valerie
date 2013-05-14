(function () {
    "use strict";

    /**
     * Contains the classes and functions that validate a view-model constructed using Knockout observables and
     * computeds.
     * @namespace
     */
    valerie.knockout = valerie.knockout || {};

    var deferEvaluation = { "deferEvaluation": true },
        definition,
        getValidationStateMethodName = "validation",
    // Shortcuts.
        FailedValidationResult = valerie.FailedValidationResult,
        passedValidationResult = valerie.PassedValidationResult.instance,
        pendingValidationResult = valerie.PendingValidationResult.instance,
        koObservable = ko.observable,
        koComputed = ko.computed,
        utils = valerie.utils,
        formatting = valerie.formatting,
        knockout = valerie.knockout,
        extras = knockout.extras;

    /**
     * Finds and returns the validation states of:
     * <ul>
     *     <li>immediate properties of the given model</li>
     *     <li>immediate sub-models of the given model, if specified</li>
     *     <li>descendant properties of the given model, if specified</li>
     *     <li>descendant sub-models of the given model, if specified</li>
     * </ul>
     * @memberof valerie.knockout
     * @param {object} model the model to find validation states in
     * @param {boolean} [includeSubModels = true] whether to return the validation states of child
     * sub-models
     * @param {boolean} [recurse = false] whether to inspect the descendant properties and, if specified,
     * descendant sub-models of child sub-models
     * @param {IValidationState[]} [validationStates] the already inspected validation states; this parameter is used
     * in recursive invocations
     */
    knockout.findValidationStates = function (model, includeSubModels, recurse, validationStates) {
        if (!(1 in arguments)) {
            includeSubModels = true;
        }

        if (!(2 in arguments)) {
            recurse = false;
        }

        if (!(3 in arguments)) {
            validationStates = [];
        }

        var name,
            validationState,
            value;

        for (name in model) {
            if (model.hasOwnProperty(name)) {
                value = model[name];

                if (value == null) {
                    continue;
                }

                validationState = knockout.getValidationState(value);

                if (ko.isObservable(value)) {
                    value = value.peek();
                }

                if (utils.isFunction(value)) {
                    continue;
                }

                if (utils.isArrayOrObject(value)) {
                    if (includeSubModels && validationState) {
                        validationStates.push(validationState);
                    }

                    if (recurse) {
                        knockout.findValidationStates(value, includeSubModels, true, validationStates);
                    }
                } else {
                    if (validationState) {
                        validationStates.push(validationState);
                    }
                }
            }
        }

        return validationStates;
    };

    /**
     * Gets the validation state for the given model, observable or computed.
     * This function is useful when developing binding handlers.
     * @memberof valerie.knockout
     * @param {*} modelOrObservableOrComputed the thing to get the validation state for
     * @return {null|IValidationState} the validation state or <code>null</code> if the given thing does not have a
     * validation state.
     */
    knockout.getValidationState = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return null;
        }

        if (!modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName)) {
            return null;
        }

        return modelOrObservableOrComputed[getValidationStateMethodName]();
    };

    /**
     * Informs if the given model, observable or computed has a validation state.
     * This function is useful when developing binding handlers.
     * @memberof valerie.knockout
     * @param {*} modelOrObservableOrComputed the thing to test
     * @return {boolean} whether the given thing has a validation state
     */
    knockout.hasValidationState = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return false;
        }

        return modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName);
    };

    /**
     * Sets the validation state for the given model, observable or computed.
     * @param {object|function} modelOrObservableOrComputed the thing to set the validation state on
     * @param {IValidationState} state the validation state to use
     */
    knockout.setValidationState = function (modelOrObservableOrComputed, state) {
        modelOrObservableOrComputed[getValidationStateMethodName] = function () {
            return state;
        };
    };

    /**
     * Makes the passed-in model validatable. After invocation the model will have a validation state.
     * <br/><b>fluent</b>
     * @memberof valerie.knockout
     * @param {object|function} model the model to make validatable
     * @param {object} [options] the options to use when creating the model's validation state
     * @returns {knockout.ModelValidationState} the validation state belonging to the model
     */
    knockout.validatableModel = function (model, options) {
        var validationState = new knockout.ModelValidationState(model, options);

        knockout.setValidationState(model, validationState);

        return validationState;
    };

    /**
     * Makes the passed-in property validatable. After invocation the property will have a validation state.
     * <br/><b>fluent</b>
     * @memberof valerie.knockout
     * @param {function} observableOrComputed the Knockout observable or computed to make validatable
     * @param {object} [options] the options to use when creating the property's validation state
     * @returns {knockout.PropertyValidationState} the validation state belonging to the property
     * @throws Only observables or computeds can be made validatable properties.
     */
    knockout.validatableProperty = function (observableOrComputed, options) {
        if (!ko.isSubscribable(observableOrComputed)) {
            throw "Only observables or computeds can be made validatable properties.";
        }

        var validationState = new knockout.PropertyValidationState(observableOrComputed, options);

        knockout.setValidationState(observableOrComputed, validationState);

        return validationState;
    };

    // + ModelValidationState
    // - validation state for a model
    // - the model may comprise of simple or complex properties
    (function () {
        // Functions for computeds.
        var failedFunction = function () {
                return this.result().failed;
            },
            failedStatesFunction = function () {
                var failedStates = [],
                    validationStates = this.validationStates(),
                    validationState,
                    result,
                    index;

                for (index = 0; index < validationStates.length; index++) {
                    validationState = validationStates[index];

                    if (validationState.settings.applicable()) {
                        result = validationState.result();

                        if (result.failed) {
                            failedStates.push(validationState);
                        }
                    }
                }

                return failedStates;
            },
            messageFunction = function () {
                return this.result().message;
            },
            passedFunction = function () {
                return this.result().passed;
            },
            pendingFunction = function () {
                return this.result().pending;
            },
            pendingStatesFunction = function () {
                var pendingStates = [],
                    validationStates = this.validationStates(),
                    validationState,
                    index;

                for (index = 0; index < validationStates.length; index++) {
                    validationState = validationStates[index];

                    if (validationState.result().pending) {
                        pendingStates.push(validationState);
                    }
                }

                return pendingStates;
            },
            resultFunction = function () {
                if (this.failedStates().length > 0) {
                    return new FailedValidationResult(this.settings.failureMessageFormat);
                }

                if (this.pendingStates().length > 0) {
                    return pendingValidationResult;
                }

                return passedValidationResult;
            },
            touchedReadFunction = function () {
                var index,
                    validationStates = this.validationStates();

                for (index = 0; index < validationStates.length; index++) {
                    if (validationStates[index].touched()) {
                        return true;
                    }
                }

                return false;
            },
            touchedWriteFunction = function (value) {
                var index,
                    validationStates = this.validationStates();

                for (index = 0; index < validationStates.length; index++) {
                    validationStates[index].touched(value);
                }
            };

        definition = knockout.ModelValidationState = function (model, options) {
            options = utils.mergeOptions(knockout.ModelValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);

            this.model = model;
            this.settings = options;
            this.summary = koObservable([]);
            this.validationStates = ko.observableArray();

            // Computeds.
            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.failedStates = koComputed(failedStatesFunction, this, deferEvaluation);
            this.message = koComputed(messageFunction, this, deferEvaluation);
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.pending = koComputed(pendingFunction, this, deferEvaluation);
            this.pendingStates = koComputed(pendingStatesFunction, this, deferEvaluation);
            this.result = extras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);
            this.touched = koComputed({
                "read": touchedReadFunction,
                "write": touchedWriteFunction,
                "deferEvaluation": true,
                "owner": this
            });

            this.paused = this.result.paused;
            this.refresh = this.result.refresh;
        };

        definition.prototype = {
            // Validation state methods support a fluent interface.
            "addValidationStates": function (validationStates) {
                this.validationStates.push.apply(this.validationStates, validationStates);

                return this;
            },
            "applicable": function (valueOrFunction) {
                if (valueOrFunction == null) {
                    valueOrFunction = true;
                }

                this.settings.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "clearSummary": function (clearSubModelSummaries) {
                var states,
                    state,
                    index;

                this.summary([]);

                if (clearSubModelSummaries) {
                    states = this.validationStates();

                    for (index = 0; index < states.length; index++) {
                        state = states[index];

                        if (state.clearSummary) {
                            state.clearSummary();
                        }
                    }
                }

                return this;
            },
            "name": function (valueOrFunction) {
                this.settings.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "end": function () {
                return this.model;
            },
            "removeValidationStates": function (validationStates) {
                this.validationStates.removeAll(validationStates);

                return this;
            },
            "stopValidatingSubModel": function (validatableSubModel) {
                this.validationStates.removeAll(validatableSubModel.validation().validationStates.peek());

                return this;
            },
            "updateSummary": function (updateSubModelSummaries) {
                var states = this.failedStates(),
                    state,
                    index,
                    failures = [];

                for (index = 0; index < states.length; index++) {
                    state = states[index];

                    failures.push({
                        "name": state.settings.name(),
                        "message": state.message()
                    });
                }

                this.summary(failures);

                if (updateSubModelSummaries) {
                    states = this.validationStates();

                    for (index = 0; index < states.length; index++) {
                        state = states[index];

                        if (state.updateSummary) {
                            state.updateSummary();
                        }
                    }
                }

                return this;
            },
            "validateAll": function () {
                var validationStates = knockout.findValidationStates(this.model, true, true);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateAllProperties": function () {
                var validationStates = knockout.findValidationStates(this.model, false, true);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateMyProperties": function () {
                var validationStates = knockout.findValidationStates(this.model, false, false);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateMyPropertiesAndSubModels": function () {
                var validationStates = knockout.findValidationStates(this.model, true, false);
                this.addValidationStates(validationStates);

                return this;
            }
        };

        definition.defaultOptions = {
            "applicable": utils.asFunction(true),
            "failureMessageFormat": "",
            "name": utils.asFunction("(?)"),
            "paused": null
        };
    })();
})();
