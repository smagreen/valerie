// This file contains documentation for interfaces in the library.
// These interfaces are not available to use in the run-time code.

/**
 * The interface for a Converter, a pair of functions: <code>format</code> and <parse>parse</parse>, which work in tandem
 * on a single type of value.
 * @class
 */
valerie.converters.IConverter = function () {
    return {
        /**
         * Formats the given value as a string.
         * @name valerie.converters.IConverter#format
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
         * @name valerie.converters.IConverter#parse
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
