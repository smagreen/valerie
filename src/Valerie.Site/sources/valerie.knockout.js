// valerie.knockout
// - the class and functions that validate a view-model constructed using knockout observables and computeds
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.converters.js"/>
/// <reference path="valerie.rules.js"/>
/// <reference path="valerie.extras.js"/>

/*global ko: false, valerie: false */

(function() {
    "use strict";

    var utils = valerie.utils,
        converters = valerie.converters,
        rules = valerie.rules,
        knockout = valerie.knockout,
        extras = knockout.extras,
        koObservable = ko.observable,
        koComputed = ko.computed,
        deferEvaluation = { "deferEvaluation": true },
        getValidationStateMethodName = "validation",
        definition;

    // + getValidationState
    // - gets the validation state from a model, observable or computed
    // - for use when developing bindings
    knockout.getValidationState = function(modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed === undefined || modelOrObservableOrComputed === null) {
            return undefined;
        }

        if (!modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName)) {
            return undefined;
        }

        return modelOrObservableOrComputed[getValidationStateMethodName]();
    };

    // + hasValidationState
    // - determines if the given model, observable or computed has a validation state
    // - for use when developing bindings
    knockout.hasValidationState = function(modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed === undefined || modelOrObservableOrComputed === null) {
            return false;
        }

        return modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName);
    };

    // + setValidationState
    // - sets the validation state on the model, observable or computed
    // - for use when configuring validation in a non-fluent manner
    knockout.setValidationState = function(modelOrObservableOrComputed, state) {
        modelOrObservableOrComputed[getValidationStateMethodName] = function() {
            return state;
        };
    };

    // + findValidationStates
    // - finds and returns the validation states of:
    //   - properties for the given model
    //   - sub-models of the given model, if permitted
    //   - descendant properties and sub-models of the given model, if requested
    knockout.findValidationStates = function(model, includeSubModels, recurse, validationStates) {

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

                if (value === undefined || value === null) {
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

    // + validatableModel
    // - makes the model passed in validatable
    knockout.validatableModel = function(model, options) {
        var validationState = new knockout.ModelValidationState(model, options);

        knockout.setValidationState(model, validationState);

        // Return the validation state so it can be used in a fluent manner.
        return validationState;
    };

    // + validatableProperty
    // - makes the observable, observable array or computed passed in validatable
    knockout.validatableProperty = function(observableOrComputed, options) {
        if (!ko.isSubscribable(observableOrComputed)) {
            throw "Only observables or computeds can be made validatable properties.";
        }

        var validationState = new knockout.PropertyValidationState(observableOrComputed, options);

        knockout.setValidationState(observableOrComputed, validationState);

        // Return the validation state so it can be used in a fluent manner.
        return validationState;
    };

    // + ValidationResult
    // - the result of a validation test
    definition = knockout.ValidationResult = function(failed, failureMessage) {
        this.failed = failed;
        this.failureMessage = failureMessage;
    };

    definition.success = new knockout.ValidationResult(false, "", []);

    // + ModelValidationState
    // - validation state for a model
    // - the model may comprise of simple or complex properties
    (function() {
        var failedFunction = function() {
            return this.result().failed;
        },
            invalidStatesFunction = function() {
                var invalidStates = [],
                    validationStates = this.validationStates(),
                    validationState,
                    result,
                    index;

                for (index = 0; index < validationStates.length; index++) {
                    validationState = validationStates[index];

                    if (validationState.settings.applicable()) {
                        result = validationStates[index].result();

                        if (result.failed) {
                            invalidStates.push(validationState);
                        }
                    }
                }

                return invalidStates;
            },
            messageFunction = function() {
                return this.result().failureMessage;
            },
            passedFunction = function() {
                return !this.result().failed;
            },
            resultFunction = function() {
                var invalidStates = this.invalidStates(),
                    message;

                if (invalidStates.length === 0) {
                    return knockout.ValidationResult.success;
                }

                message = utils.formatString(this.settings.failureMessageFormat,
                    { "failureCount": invalidStates.length });

                return new knockout.ValidationResult(true, message);
            },
            touchedReadFunction = function() {
                var index,
                    validationStates = this.validationStates();

                for (index = 0; index < validationStates.length; index++) {
                    if (validationStates[index].touched()) {
                        return true;
                    }
                }

                return false;
            },
            touchedWriteFunction = function(value) {
                var index,
                    validationStates = this.validationStates();

                for (index = 0; index < validationStates.length; index++) {
                    validationStates[index].touched(value);
                }
            };

        definition = knockout.ModelValidationState = function(model, options) {
            options = utils.mergeOptions(knockout.ModelValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);

            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.failuresSnapshot = koObservable([]);
            this.invalidStates = koComputed(invalidStatesFunction, this, deferEvaluation);
            this.message = koComputed(messageFunction, this, deferEvaluation);
            this.model = model;
            this.settings = options;
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.result = extras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);
            this.touched = koComputed({
                "read": touchedReadFunction,
                "write": touchedWriteFunction,
                "deferEvaluation": true,
                "owner": this
            });
            this.validationStates = ko.observableArray();

            this.paused = this.result.paused;
            this.refresh = this.result.refresh;
        };

        definition.prototype = {
            "addValidationStates": function(validationStates) {
                this.validationStates.push.apply(this.validationStates, validationStates);

                return this;
            },
            "clearFailuresSnapshot": function(clearSubSnapshots) {
                var states,
                    state,
                    index;

                this.failuresSnapshot([]);

                if (clearSubSnapshots) {
                    states = this.validationStates();

                    for (index = 0; index < states.length; index++) {
                        state = states[index];

                        if (state.clearFailuresSnapshot) {
                            state.clearFailuresSnapshot();
                        }
                    }
                }

                return this;
            },
            "removeValidationStates": function(validationStates) {
                this.validationStates.removeAll(validationStates);

                return this;
            },
            "stopValidatingSubModel": function(validatableSubModel) {
                this.validationStates.removeAll(validatableSubModel.validation().validationStates.peek());

                return this;
            },
            "updateFailuresSnapshot": function(updateSubSnapshots) {
                var states = this.invalidStates(),
                    state,
                    index,
                    failures = [];

                for (index = 0; index < states.length; index++) {
                    state = states[index];

                    failures.push({
                        "name": state.settings.name(),
                        "message": state.message(),
                    });
                }

                this.failuresSnapshot(failures);

                if (updateSubSnapshots) {
                    states = this.validationStates();

                    for (index = 0; index < states.length; index++) {
                        state = states[index];

                        if (state.updateFailuresSnapshot) {
                            state.updateFailuresSnapshot();
                        }
                    }
                }

                return this;
            },

            // Methods used when creating the validation state.
            "end": function() {
                return this.model;
            },
            "name": function(valueOrFunction) {
                this.settings.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "validateAll": function() {
                var validationStates = knockout.findValidationStates(this.model, true, true);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateAllProperties": function() {
                var validationStates = knockout.findValidationStates(this.model, false, true);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateMyProperties": function() {
                var validationStates = knockout.findValidationStates(this.model, false, false);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateMyPropertiesAndSubModels": function() {
                var validationStates = knockout.findValidationStates(this.model, true, false);
                this.addValidationStates(validationStates);

                return this;
            }
        };

        definition.defaultOptions = {
            "applicable": utils.asFunction(true),
            "failureMessageFormat": "There are {failureCount} validation errors." /*resource*/,
            "name": utils.asFunction("(no-name-set)"),
            "paused": undefined
        };
    })();

    // + PropertyValidationState
    // - validation state for a single, simple, observable or computed property
    (function() {
        var missingResultFunction = function() {
            var value = this.observableOrComputed();

            if (!this.settings.required() || !this.settings.missingTest(value)) {
                return knockout.ValidationResult.success;
            }

            return {
                "failed": true,
                "failureMessage": this.settings.missingFailureMessage
            };
        },
            ruleResultFunction = function() {
                var value = this.observableOrComputed();

                return this.settings.rule.test(value);
            },
            resultFunction = function() {
                var result;

                result = this.boundEntry.result();
                if (result.failed) {
                    return result;
                }

                result = missingResultFunction.apply(this);
                if (result.failed) {
                    return result;
                }

                result = ruleResultFunction.apply(this);
                if (result.failed) {
                    return result;
                }

                return knockout.ValidationResult.success;
            },
            failedFunction = function() {
                return this.result().failed;
            },
            messageFunction = function() {
                var message = this.result().failureMessage;

                message = utils.formatString(message, { "name": this.settings.name() });

                return message;
            },
            passedFunction = function() {
                return !this.result().failed;
            },
            showMessageFunction = function() {
                if (!this.settings.applicable()) {
                    return false;
                }

                return this.touched() && this.result().failed;
            };

        // Constructor Function
        // - settings can be modified using a fluent interface
        definition = knockout.PropertyValidationState = function(observableOrComputed, options) {
            options = utils.mergeOptions(knockout.PropertyValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);
            options.required = utils.asFunction(options.required);

            this.boundEntry = {
                "focused": koObservable(false),
                "result": koObservable(knockout.ValidationResult.success),
                "textualInput": false
            };

            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.message = extras.pausableComputed(messageFunction, this, deferEvaluation);
            this.observableOrComputed = observableOrComputed;
            this.settings = options;
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.result = koComputed(resultFunction, this, deferEvaluation);
            this.showMessage = extras.pausableComputed(showMessageFunction, this, deferEvaluation);
            this.touched = koObservable(false);
        };

        definition.prototype = {
            // Methods used when creating the validation state.
            "applicable": function(valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.settings.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "between": function(minimumValueOrFunction, maximumValueOrFunction) {
                this.settings.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction);

                return this;
            },
            "end": function() {
                this.settings.rule.settings.valueFormat = this.settings.valueFormat;
                this.settings.rule.settings.valueFormatter = this.settings.converter.formatter;

                return this.observableOrComputed;
            },
            "integer": function() {
                this.settings.converter = converters.integer;

                return this;
            },
            "name": function(valueOrFunction) {
                this.settings.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "required": function(valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.settings.required = utils.asFunction(valueOrFunction);

                return this;
            }
        };

        // Define default options.
        definition.defaultOptions = {
            "applicable": utils.asFunction(true),
            "converter": converters.passThrough,
            "entryFormat": undefined,
            "invalidEntryFailureMessage": "The value entered is invalid.", /*resource*/
            "missingFailureMessage": "A value is required.", /*resource*/
            "missingTest": utils.isMissing,
            "name": utils.asFunction(),
            "required": utils.asFunction(false),
            "rule": new rules.PassThrough(),
            "valueFormat": undefined
        };
    })();

    // + validate extension function
    // - creates and returns the validation state for an observable or computed
    koObservable.fn.validate = koComputed.fn.validate = function(validationOptions) {

        // Create the validation state, then return it, so it can be modified fluently.
        return knockout.validatableProperty(this, validationOptions);
    };
})();
