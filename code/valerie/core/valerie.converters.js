(function () {
    "use strict";

    /**
     * Contains converters, always singletons.
     * @namespace
     * @see valerie.IConverter
     */
    valerie.converters = {};

    /**
     * A converter which formats and parses strings.
     * Used as the default converter in numerous places throughout the library.
     * @name valerie.converters~passThrough
     * @type valerie.IConverter
     */
    valerie.converters.passThrough = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parse": function (value) {
            return value;
        }
    };
})();
