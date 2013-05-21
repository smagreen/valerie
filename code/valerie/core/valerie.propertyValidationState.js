(function () {
    "use strict";

    var deferEvaluation = { "deferEvaluation": true },
    // Shortcuts.
        utils = valerie.utils,
        formatting = valerie.formatting,
        koExtras = valerie.koExtras,
        koObservable = ko.observable,
        koComputed = ko.computed,
        passedValidationResult = valerie.ValidationResult.passedInstance,

    // Functions used by computeds.
        missingFunction = function (validationState) {
            var value = validationState.observableOrComputed(),
                missing = validationState.settings.missingTest(value),
                required = validationState.settings.required();

            if (missing && required) {
                return -1;
            }

            if (missing && !required) {
                return 0;
            }

            return 1;
        },
        rulesResultFunction = function (validationState) {
            var value = validationState.observableOrComputed(),
                rules = validationState.settings.rules,
                rule,
                result,
                index;

            for (index = 0; index < rules.length; index++) {
                rule = rules[index];

                result = rule.test(value);

                if (result.failed || result.pending) {
                    return result;
                }
            }

            return passedValidationResult;
        },
    // Functions for computeds.
        failedFunction = function () {
            return this.result().failed;
        },
        messageFunction = function () {
            var message = this.result().message;

            message = formatting.replacePlaceholders(message, { "name": this.settings.name() });

            return message;
        },
        passedFunction = function () {
            return this.result().passed;
        },
        pendingFunction = function () {
            return this.result().pending;
        },
        resultFunction = function () {
            var missingResult,
                result;

            result = this.boundEntry.result();
            if (result.failed) {
                return result;
            }

            missingResult = missingFunction(this);

            if (missingResult === -1) {
                return valerie.ValidationResult.createFailedResult(this.settings.missingFailureMessage);
            }

            if (missingResult === 0) {
                return result;
            }


            return rulesResultFunction(this);
        },
        showMessageFunction = function () {
            if (!this.settings.applicable()) {
                return false;
            }

            return this.touched() && this.result().failed;
        };

    /**
     * Construction options for a property validation state.
     * @typedef {object} valerie.PropertyValidationState.options
     * @property {function} applicable the function used to determine if the property is applicable
     * @property {valerie.IConverter} converter the converter used to parse user
     * entries and format display of the property's value
     * @property {string} entryFormat the string used to format the property's value for display in a user entry
     * @property {boolean} excludeFromSummary whether any validation failures for this property are excluded from a summary
     * @property {string} invalidFailureMessage the message shown when the user has entered an invalid value
     * @property {string} missingFailureMessage the message shown when a value is required but is missing
     * @property {function} name the function used to determine the name of the property; used in failure messages
     * @property {function} required the function used to determine if a value is required
     * @property {valerie.array<IRule>} rules the chain of rules used to validate the property's value
     * @property {string} valueFormat the string use to format the property's value for display in a message
     */

    /**
     * Constructs the validation state for a simple, single, observable or computed property.
     * @constructor
     * @param {function} observableOrComputed the observable or computed the validation state is for
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to use when creating the
     * validation state
     */
    valerie.PropertyValidationState = function (observableOrComputed, options) {
        //noinspection JSValidateTypes
        options = utils.mergeOptions(valerie.PropertyValidationState.defaultOptions, options);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.applicable = utils.asFunction(options.applicable);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.name = utils.asFunction(options.name);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.required = utils.asFunction(options.required);

        // Available, but not for "consumer" use.
        this.boundEntry = {
            "focused": koObservable(false),
            "result": koObservable(passedValidationResult),
            "textualInput": false
        };

        /**
         * Gets whether the value held by or entered for the property fails validation.
         * @method
         * @return {boolean} <code>true</code> if validation has failed, <code>false</code> otherwise
         */
        this.failed = koComputed(failedFunction, this, deferEvaluation);

        /**
         * Gets a message describing the validation state.
         * @method
         * @return {string} the message, can be empty
         */
        this.message = koExtras.pausableComputed(messageFunction, this, deferEvaluation);

        /**
         * Gets whether the value held by or entered for the property passes validation.
         * @method
         * @return {boolean} <code>true</code> if validation has passed, <code>false</code> otherwise
         */
        this.passed = koComputed(passedFunction, this, deferEvaluation);

        /**
         * The observable or computed this validation state is for.
         * @type {function}
         */
        this.observableOrComputed = observableOrComputed;

        /**
         * Gets whether validation for the property hasn't yet completed.
         * @method
         * @return {boolean} <code>true</code> is validation is pending, <code>false</code> otherwise
         */
        this.pending = koComputed(pendingFunction, this, deferEvaluation);

        /**
         * Gets the result of the validation.
         * @method
         * @return {valerie.ValidationResult} the result
         */
        this.result = koComputed(resultFunction, this, deferEvaluation);

        /**
         * The settings for this validation state.
         * @type {valerie.PropertyValidationState.options}
         */
        this.settings = options;

        /**
         * Gets the name of the property.
         * @method
         * @return {string} the name of the property
         */
        this.getName = function () {
            return this.settings.name();
        };

        /**
         * Gets whether the property is applicable.
         * @method
         * @return {boolean} <code>true</code> if the property is applicable, <code>false</code> otherwise
         */
        this.isApplicable = function () {
            return this.settings.applicable();
        };

        /**
         * Gets whether the message describing the validation state should be shown.
         * @method
         * @return {boolean} <code>true</code> if the message should be shown, <code>false</code> otherwise
         */
        this.showMessage = koExtras.pausableComputed(showMessageFunction, this, deferEvaluation);

        /**
         * Gets or sets whether the property has been "touched" by a user action.
         * @method
         * @param {boolean} [value] <code>true</code> if the property should marked as touched, <code>false</code> if
         * the property should be marked as untouched
         * @return {boolean} <code>true</code> if the property has been "touched", <code>false</code> otherwise
         */
        this.touched = koObservable(false);
    };

    valerie.PropertyValidationState.prototype = {
        /**
         * Adds a rule to the chain of rules used to validate the property's value.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {valerie.IRule} rule the rule to add
         * @return {valerie.PropertyValidationState}
         */
        "addRule": function (rule) {
            this.settings.rules.push(rule);

            return this;
        },
        /**
         * Sets the value or function used to determine if the property is applicable.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean|function} [valueOrFunction = true] the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "applicable": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.applicable = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Ends a chain of fluent method calls on this property validation state.<br/>
         * Applies the <b>options.valueFormat</b> format string to all the rules in the rule chain.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {function} the observable or computed the validation state is for
         */
        "end": function () {
            var index,
                settings = this.settings,
                valueFormat = settings.valueFormat,
                rules = settings.rules,
                ruleSettings;

            for (index = 0; index < rules.length; index++) {
                ruleSettings = rules[index].settings;

                ruleSettings.valueFormat = valueFormat;
            }

            return this.observableOrComputed;
        },
        /**
         * Sets the format string used to format the display of the value in an entry.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string} format the format string to use
         * @return {valerie.PropertyValidationState}
         */
        "entryFormat": function (format) {
            this.settings.entryFormat = format;

            return this;
        },
        /**
         * Excludes any validation failures for this property from a validation summary.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.PropertyValidationState}
         */
        "excludeFromSummary": function () {
            this.settings.excludeFromSummary = true;

            return this;

        },
        /**
         * Sets the value or function used to determine the name of the property.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string|function} valueOrFunction the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "name": function (valueOrFunction) {
            this.settings.name = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Sets the value or function used to determine the if the property is required.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean|function} [valueOrFunction = false] the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "required": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.required = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Sets the format string used to format the display of the value.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string} format the format string to use
         * @return {valerie.PropertyValidationState}
         */
        "valueFormat": function (format) {
            this.settings.valueFormat = format;

            return this;
        }
    };

    /**
     * The default options used when constructing a property validation state.
     * @name valerie.PropertyValidationState.defaultOptions
     * @lends valerie.PropertyValidationState.options
     */
    valerie.PropertyValidationState.defaultOptions = {
        "applicable": utils.asFunction(true),
        "converter": valerie.converters.passThrough,
        "entryFormat": null,
        "excludeFromSummary": false,
        "invalidEntryFailureMessage": "",
        "missingFailureMessage": "",
        "missingTest": utils.isMissing,
        "name": utils.asFunction(),
        "required": utils.asFunction(false),
        "rules": [],
        "valueFormat": null
    };

    /**
     * Makes the passed-in property validatable. After invocation the property will have a validation state.
     * <br/><b>fluent</b>
     * @param {function} observableOrComputed the Knockout observable or computed to make validatable
     * @param {valerie.PropertyValidationState.options} [options] the options to use when creating the property's
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the property
     * @throws {string} Only observables or computeds can be made validatable properties.
     */
    valerie.validatableProperty = function (observableOrComputed, options) {
        if (!ko.isSubscribable(observableOrComputed)) {
            throw "Only observables or computeds can be made validatable properties.";
        }

        var validationState = new valerie.PropertyValidationState(observableOrComputed, options);

        valerie.validationState.setFor(observableOrComputed, validationState);

        return validationState;
    };
})();
