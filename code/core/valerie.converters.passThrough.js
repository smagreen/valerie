(function () {
    "use strict";

    /**
     * Contains converters. A converter is a static object which can parse string representations of a value type and
     * format values of a value type as a string.
     * @namespace
     * @inner
     */
    valerie.converters = valerie.converters || {};

    /**
     * A converter which formats and parses strings.
     * Used as the default converter in numerous places throughout the library.
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
