(function () {
    "use strict";

    /**
     * Contains the <code>passThrough</code> converter.
     * @namespace
     */
    valerie.converters = {};

    /**
     * A converter which formats and parses strings.
     * Used as the default converter in numerous places throughout the library.
     * @class
     * @static
     * @see valerie.converters.Converter
     */
    valerie.converters.passThrough = {
        "formatter": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            return value;
        }
    };
})();
