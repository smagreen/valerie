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
     * @namespace
     * @see valerie.converters.Converter
     */
    valerie.converters.passThrough = {
        /**
         * @see valerie.converters.Converter#formatter
         */
        "formatter": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        /**
         * @see valerie.converters.Converter#parser
         */
        "parser": function (value) {
            return value;
        }
    };
})();
