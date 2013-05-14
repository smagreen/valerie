// This file contains extraneous declarations to help document the valerie library.
// These declarations are not available to use in the run-time library.

/**
 * The KnockoutJS library.
 * @namespace
 */
ko = {
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
        }
    };
};

/**
 * The interface for a validation state.
 * @constructor
 */
valerie.knockout.IValidationState = function () {

}