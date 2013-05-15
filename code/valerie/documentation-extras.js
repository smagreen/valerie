// This file contains extraneous declarations to help document the valerie library.
// These declarations are not available to use in the run-time library.

/**
 * The KnockoutJS library.
 * @namespace
 */
ko = {
    /**
     * Knockout binding handlers.<br/>
     * <br/>
     * <h3>NOTE: How valerie's Binding Handlers Choose a Property or Model</h3>
     * Most valerie binding handlers allow the property or model to work against to be specified in a number of ways.
     * For these handlers, the following algorithm describes how a property or model is chosen:
     * <ul>
     *     <li>
     *         use the value given for the binding, unless it's <code>true</code> in which case use the first found
     *         from:
     *     <ul>
     *         <li>the value of the element's <b>value</b> binding</li>
     *         <li>the value of the element's <b>checked</b> binding</li>
     *         <li>the value of the element's <b>validatedChecked</b> binding</li>
     *         <li>the value of the element's <b>validatedValue</b> binding</li>
     *         <li>the view-model object in the current context <code>($data)</code></li>
     *     </ul>
     * </ul>
     * @namespace
     */
    "bindingHandlers": {
    },
    /**
     * A Knockout computed.
     * @constructor
     */
    "computed": function () {
    },
    /**
     * A Knockout observable.
     * @constructor
     */
    "observable": function () {
    }
};

/**
 * The interface for a converter, a pair of functions: <code>format</code> and <parse>parse</parse>, which work in tandem
 * on a single type of value.
 * @class
 */
valerie.IConverter = function () {
    return {
        /**
         * Formats the given value as a string.
         * @name valerie.IConverter#format
         * @function
         * @abstract
         * @param {*} value the value to format
         * @param {string} [format] a string describing how to format the value
         * @return {string} the value formatted as a string
         */
        "format": function (value, format) {
            throw "Not implemented.";
        },
        /**
         * Parses the given string as a particular value type.
         * @name valerie.IConverter#parse
         * @function
         * @abstract
         * @param {string} value the string to parse
         * @return the parsed value, or <code>null</code> if the string could not be parsed
         */
        "parse": function (value) {
            throw "Not implemented.";
        }
    };
};

/**
 * The interface for a Rule.
 * @class
 */
valerie.IRule = function () {
    return {
        /**
         * Validates the given value.
         * @name valerie.IRule#test
         * @function
         * @abstract
         * @param {*} value the value to validate
         * @return {valerie.ValidationResult} the result of validating the value
         */
        "test": function (value) {
            throw "Not implemented.";
        },
        /**
         * The default options for the rule.
         * @memberof valerie.IRule
         * @type valerie.IRule.options
         */
        "defaultOptions": {
        }
    };
};

/**
 * The options for the rule.
 * @typedef {object} valerie.IRule.options
 * @property {string} failureMessageFormat the format of the failure message
 * @property {string} failureMessageFormatForMaximumOnly the format of the failure message for a ranged rule when only
 * a maximum value has been specified
 * @property {string} failureMessageFormatForMinimumOnly the format of the failure message for a ranged rule when only
 * a minimum value has been specified
 * @property {string} valueFormat the format to use when formatting values that may appear in a failure message
 * @property {string} valueFormatter the function to format values that may appear in a failure message
 */

/**
 * The interface for a validation state.
 * @class
 */
valerie.IValidationState = function () {
    return {
        /**
         * Gets whether validation has failed.
         * @name valerie.IValidationState#failed
         * @function
         * @abstract
         * @method
         * @return {boolean} <code>true</code> if validation has failed, <code>false</code> otherwise
         */
        "failed": function () {
            throw "Not implemented.";
        },
        /**
         * Gets the name of the item.
         * @name valerie.IValidationState#getName
         * @function
         * @abstract
         * @method
         * @return {string} the name of the item
         */
        "getName": function () {
            throw "Not implemented.";
        },
        /**
         * Gets whether the item is applicable.
         * @name valerie.IValidationState#isApplicable
         * @function
         * @abstract
         * @method
         * @return {boolean} <code>true</code> if the item is applicable, <code>false</code> otherwise
         */
        "isApplicable": function () {
            throw "Not implemented.";
        },
        /**
         * Gets a message describing the validation state.
         * @name valerie.IValidationState#message
         * @function
         * @abstract
         * @method
         * @return {string} the message, can be empty
         */
        "message": function () {
            throw "Not implemented."
        },
        /**
         * Gets whether validation has passed.
         * @name valerie.IValidationState#passed
         * @function
         * @abstract
         * @method
         * @return {boolean} <code>true</code> if validation has passed, <code>false</code> otherwise
         */
        "passed": function () {
            throw "Not implemented."
        },
        /**
         * Gets whether validation hasn't yet completed.
         * @name valerie.IValidationState#pending
         * @function
         * @abstract
         * @method
         * @return {boolean} <code>true</code> is validation is pending, <code>false</code> otherwise
         */
        "pending": function () {
            throw "Not implemented."
        },
        /**
         * Gets the result of the validation.
         * @name valerie.IValidationState#result
         * @function
         * @abstract
         * @method
         * @return {valerie.ValidationResult} the result
         */
        "result": function () {
            throw "Not implemented."
        },
        /**
         * Gets or sets whether the item has been "touched" by a user action.
         * @name valerie.IValidationState#touched
         * @function
         * @abstract
         * @method
         * @param {boolean} [value] <code>true</code> if the item should marked as touched, <code>false</code> if the
         * item should be marked as untouched
         * @return {boolean} <code>true</code> if the item has been "touched", <code>false</code> otherwise
         */
        "touched": function (value) {
            throw "Not implemented."
        }
    };
};