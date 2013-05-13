/**
 * A converter, a singleton, which can parse string representations of a value type and format values of a value
 * type as a string.
 * @class
 */
valerie.converters.Converter = function () {
    return {
        /**
         * Formats the given value as a string.
         * @name valerie.converters.Converter#formatter
         * @abstract
         * @function
         * @param {*} value the value to format
         * @param {string} [format] a string describing how to format the value
         * @return {string} the value formatted as a string
         */
        "formatter": function (value, format) {
            throw "Not implemented.";
        },
        /**
         * Parses the given string as a particular value type.
         * @name valerie.converters.Converter#parser
         * @abstract
         * @function
         * @param {string} value the string to parse
         * @return the parsed value, or <code>null</code> if the string could not be parsed
         */
        "parser": function (value) {
            throw "Not implemented.";
        }
    };
};
