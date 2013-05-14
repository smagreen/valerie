(function () {
    "use strict";

    /**
     * Contains converters, always singletons.
     * @namespace
     */
    valerie.converters = {};

    /**
     * A converter which formats and parses strings.
     * Used as the default converter in numerous places throughout the library.
     * @namespace
     * @see valerie.converters.IConverter
     */
    valerie.converters.passThrough = {
        /**
         * @see valerie.converters.IConverter#format
         */
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        /**
         * @see valerie.converters.IConverter#parse
         */
        "parse": function (value) {
            return value;
        }
    };
})();
