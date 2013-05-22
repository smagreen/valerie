(function () {
    "use strict";
    var deferEvaluation = { "deferEvaluation": true },
    // Shortcuts.
        utils = valerie.utils,
        passedValidationResult = valerie.ValidationResult.passedInstance,
        pendingValidationResult = valerie.ValidationResult.pendingInstance,
        koObservable = ko.observable,
        koComputed = ko.computed,

    // Functions for computeds.
        failedFunction = function () {
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

                if (validationState.isApplicable()) {
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

                if (validationState.isApplicable() && validationState.result().pending) {
                    pendingStates.push(validationState);
                }
            }

            return pendingStates;
        },
        resultFunction = function () {
            if (this.failedStates().length > 0) {
                return valerie.ValidationResult.createFailedResult(this.settings.failureMessageFormat);
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
                validationStates = this.validationStates(),
                validationState;

            for (index = 0; index < validationStates.length; index++) {
                validationState = validationStates[index];
                if (validationState.isApplicable()) {
                    validationState.touched(value);
                }
            }
        };

    /**
     * An item in a model validation state summary.
     * @typedef {object} valerie.ModelValidationState.summaryItem
     * @property {string} name the name of the property or sub-model which has failed validation
     * @property {string} message a message describing why validation failed
     */

    /**
     * Construction options for a model validation state.
     * @typedef {object} valerie.ModelValidationState.options
     * @property {function} applicable the function used to determine if the model is applicable
     * @property {boolean} excludeFromSummary whether any validation failures for this model are excluded from a summary
     * @property {string} failureMessage the message shown when the model is in an invalid state
     * @property {function} name the function used to determine the name of the model; used in failure messages
     * @property {function} paused a value, observable or computed used to control whether the computation that updates
     * the result of this validation state is paused.
     */

    /**
     * Constructs the validation state for a model, which may comprise of simple properties and sub-models.
     * @param model the model the validation state is for
     * @param {valerie.ModelValidationState.options} [options = default options] the options to use when creating the
     * validation state
     * @constructor
     */
    valerie.ModelValidationState = function (model, options) {
        //noinspection JSValidateTypes
        options = utils.mergeOptions(valerie.ModelValidationState.defaultOptions, options);
        //noinspection JSUnresolvedVariable,JSUndefinedPropertyAssignment
        options.applicable = utils.asFunction(options.applicable);
        //noinspection JSUnresolvedVariable,JSUndefinedPropertyAssignment
        options.name = utils.asFunction(options.name);

        /**
         * Gets whether the model has failed validation.
         * @method
         * @return {boolean} <code>true</code> if validation has failed, <code>false</code> otherwise
         */
        this.failed = koComputed(failedFunction, this, deferEvaluation);

        /**
         * Gets the validation states that belong to the model that are in a failure state.
         * @method
         * @return {array.<valerie.IValidationState>} the states that are in failure state
         */
        this.failedStates = koComputed(failedStatesFunction, this, deferEvaluation);

        /**
         * Gets a message describing the validation state.
         * @method
         * @return {string} the message, can be empty
         */
        this.message = koComputed(messageFunction, this, deferEvaluation);

        /**
         * The model this validation state is for.
         * @type {*}
         */
        this.model = model;

        /**
         * Gets whether the model has passed validation.
         * @method
         * @return {boolean} <code>true</code> if validation has passed, <code>false</code> otherwise
         */
        this.passed = koComputed(passedFunction, this, deferEvaluation);

        /**
         * Gets whether validation for the model is pending.
         * @method
         * @return {boolean} <code>true</code> is validation is pending, <code>false</code> otherwise
         */
        this.pending = koComputed(pendingFunction, this, deferEvaluation);

        /**
         * Gets the validation states that belong to the model that are in a pending state.
         * @method
         * @return {array.<valerie.IValidationState>} the states that are in pending state
         */
        this.pendingStates = koComputed(pendingStatesFunction, this, deferEvaluation);

        //noinspection JSUnresolvedVariable
        /**
         * Gets the result of the validation.
         * @method
         * @return {valerie.ValidationResult} the result
         */
        this.result = valerie.koExtras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);

        /**
         * Gets or sets whether the computation that updates the validation result has been paused.
         * @method
         * @param {boolean} [value] <code>true</code> if the computation should be paused, <code>false</code> if the
         * computation should not be paused
         * @return {boolean} <code>true</code> if the computation is paused, <code>false</code> otherwise
         */
        this.paused = this.result.paused;

        /**
         * Refreshes the validation result.
         * @method
         */
        this.refresh = this.result.refresh;

        /**
         * The settings for this validation state.
         * @type {valerie.PropertyValidationState.options}
         */
        this.settings = options;

        /**
         * Gets the name of the model.
         * @method
         * @return {string} the name of the model
         */
        this.getName = function () {
            return this.settings.name();
        };

        /**
         * Gets whether the model is applicable.
         * @method
         * @return {boolean} <code>true</code> if the model is applicable, <code>false</code> otherwise
         */
        this.isApplicable = function () {
            return this.settings.applicable();
        };

        //noinspection JSValidateJSDoc
        /**
         * Gets a static summary of the validation states are in a failure state.
         * @method
         * @return {array.<valerie.ModelValidationState.summaryItem>} the summary
         */
        this.summary = koObservable([]);

        /**
         * Gets or sets whether the model has been "touched" by a user action.
         * @method
         * @param {boolean} [value] <code>true</code> if the model should marked as touched, <code>false</code> if
         * the model should be marked as untouched
         * @return {boolean} <code>true</code> if the model has been "touched", <code>false</code> otherwise
         */
        this.touched = koComputed({
            "read": touchedReadFunction,
            "write": touchedWriteFunction,
            "deferEvaluation": true,
            "owner": this
        });

        /**
         * Gets the validation states that belong to this model.
         * @method
         * @return {array.<valerie.IValidationState>} the validation states
         */
        this.validationStates = ko.observableArray();
    };

    valerie.ModelValidationState.prototype = {
        /**
         * Adds validation states to this validation state.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#addValidationStates
         * @fluent
         * @param {object|array.<valerie.IValidationState>} validationStateOrStates the validation states to add
         * @return {valerie.ModelValidationState}
         */
        "addValidationStates": function (validationStateOrStates) {
            validationStateOrStates = utils.asArray(validationStateOrStates);

            //noinspection JSValidateTypes
            this.validationStates.push.apply(this.validationStates, validationStateOrStates);

            return this;
        },
        /**
         * Sets the value or function used to determine if the model is applicable.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#applicable
         * @fluent
         * @param {boolean|function} [valueOrFunction = true] the value or function to use
         * @return {valerie.ModelValidationState}
         */
        "applicable": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.applicable = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Clears the static summary of validation states that are in a failure state.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#clearSummary
         * @fluent
         * @param {boolean} [clearSubModelSummaries = false] whether to clear the static summaries for sub-models
         * @return {valerie.ModelValidationState}
         */
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
                        state.clearSummary(true);
                    }
                }
            }

            return this;
        },
        /**
         * Ends a chain of fluent method calls on this model validation state.
         * @return {function} the model the validation state is for
         */
        "end": function () {
            return this.model;
        },
        /**
         * Includes any validation failures for this property in a validation summary.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "includeInSummary": function () {
            this.settings.excludeFromSummary = false;

            return this;

        },
        /**
         * Sets the value or function used to determine the name of the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string|function} valueOrFunction the value or function to use
         * @return {valerie.ModelValidationState}
         */
        "name": function (valueOrFunction) {
            this.settings.name = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Removes validation states.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {object|array.<valerie.IValidationState>} validationStateOrStates the validation states to remove
         * @return {valerie.ModelValidationState}
         */
        "removeValidationStates": function (validationStateOrStates) {
            validationStateOrStates = utils.asArray(validationStateOrStates);

            this.validationStates.removeAll(validationStateOrStates);

            return this;
        },
        /**
         * Stops validating the given sub-model by adding the validation state that belongs to it.
         * @param {*} validatableSubModel the sub-model to start validating
         * @return {valerie.ModelValidationState}
         */
        "startValidatingSubModel": function (validatableSubModel) {
            this.validationStates.push(validatableSubModel.validation());

            return this;
        },
        /**
         * Stops validating the given sub-model by removing the validation state that belongs to it.
         * @param {*} validatableSubModel the sub-model to stop validating
         * @return {valerie.ModelValidationState}
         */
        "stopValidatingSubModel": function (validatableSubModel) {
            this.validationStates.remove(validatableSubModel.validation());

            return this;
        },
        /**
         * Updates the static summary of validation states that are in a failure state.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean} [updateSubModelSummaries = false] whether to update the static summaries for sub-models
         * @return {valerie.ModelValidationState}
         */
        "updateSummary": function (updateSubModelSummaries) {
            var states = this.failedStates(),
                state,
                index,
                failures = [];

            for (index = 0; index < states.length; index++) {
                state = states[index];

                if (!state.settings.excludeFromSummary) {
                    failures.push({
                        "name": state.getName(),
                        "message": state.message()
                    });
                }
            }

            this.summary(failures);

            if (updateSubModelSummaries) {
                states = this.validationStates();

                for (index = 0; index < states.length; index++) {
                    state = states[index];

                    if (state.isApplicable() && state.updateSummary) {
                        state.updateSummary(true);
                    }
                }
            }

            return this;
        },
        /**
         * Adds the validation states for all the descendant properties and sub-models that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateAll": function () {
            var validationStates = valerie.validationState.findIn(this.model, true, true);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the descendant properties that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateAllProperties": function () {
            var validationStates = valerie.validationState.findIn(this.model, false, true);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the child properties that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateChildProperties": function () {
            var validationStates = valerie.validationState.findIn(this.model, false, false);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the child properties and sub-models that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateChildPropertiesAndSubModels": function () {
            var validationStates = valerie.validationState.findIn(this.model, true, false);
            this.addValidationStates(validationStates);

            return this;
        }
    };

    /**
     * The default options used when constructing a model validation state.
     * @name valerie.ModelValidationState.defaultOptions
     * @lends valerie.ModelValidationState.options
     */
    valerie.ModelValidationState.defaultOptions = {
        "applicable": utils.asFunction(true),
        "excludeFromSummary": true,
        "failureMessageFormat": "",
        "name": utils.asFunction("(?)"),
        "paused": null
    };

    /**
     * Makes the passed-in model validatable. After invocation the model will have a validation state.
     * <br/><b>fluent</b>
     * @param {object|function} model the model to make validatable
     * @param {valerie.ModelValidationState.options} [options] the options to use when creating the model's validation
     * state
     * @return {valerie.ModelValidationState} the validation state belonging to the model
     */
    valerie.validatableModel = function (model, options) {
        var validationState = new valerie.ModelValidationState(model, options);

        valerie.validationState.setFor(model, validationState);

        return validationState;
    };
})();
