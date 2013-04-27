// valerie.converters
// - general purpose converters
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        helpers = valerie.converters.helpers = valerie.converters.helpers || {},
        floatTestExpression = new RegExp("^\\d+(\\,\\d{3})*(\\.\\d+)?$"),
        integerTestExpression = new RegExp("^\\d+(\\,\\d{3})*$");

    // + converters.helpers.addCommasToNumberString
    helpers.addCommasToNumberString = function (numberString) {
        var wholeAndFractionalParts = numberString.toString().split("."),
            wholePart = wholeAndFractionalParts[0];

        wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        wholeAndFractionalParts[0] = wholePart;

        return wholeAndFractionalParts.join(".");
    };

    // + converters.float
    converters.float = {
        "formatter": function (value, format) {
            if (value === undefined || value === null) {
                return "";
            }
            
            if (format === undefined || format === null) {
                format = "";
            }

            value = value.toString();
            
            if (format.indexOf(",") !== -1) {
                value = helpers.addCommasToNumberString(value);
            }

            return value;
        },
        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            if (!floatTestExpression.test(value)) {
                return undefined;
            }

            value = value.replace(",", "");

            return Number(value);
        }
    };

    // + converters.integer
    converters.integer = {
        "formatter": function(value, format) {
            if (value === undefined || value === null) {
                return "";
            }

            if (format === undefined || format === null) {
                format = "";
            }

            value = value.toString();

            if (format.indexOf(",") !== -1) {
                value = helpers.addCommasToNumberString(value);
            }

            return value;
        },
        "parser": function(value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            if (!integerTestExpression.test(value)) {
                return undefined;
            }

            value = value.replace(",", "");

            return Number(value);
        }
    };

    // + converters.passThrough
    converters.passThrough = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            return value;
        }
    };

    // + converters.string
    converters.string = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value;
        },

        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            return value;
        }
    };
})();
