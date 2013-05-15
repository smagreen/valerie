(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        postcodeExpression = /^([A-Z][A-Z]?)((?:[0-9][A-Z])|(?:[0-9]{1,2}))\s*([0-9])([A-Z][A-Z])$/i;

    /**
     * A converter for postcodes.<br/>
     * <i>[full, en-gb]</i>
     * @name valerie.converters~postcode
     * @type valerie.IConverter
     */
    converters.postcode = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value;
        },
        "parse": function (value) {
            if (value == null) {
                return null;
            }

            var matches = value.match(postcodeExpression);

            if (matches == null) {
                return null;
            }

            return (matches[1] + matches[2] + " " + matches[3] + matches[4]).toUpperCase();
        }
    };
})();
