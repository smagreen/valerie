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
        formatting = valerie.formatting,
        floatTestExpression = new RegExp("^\\d+(\\,\\d{3})*(\\.\\d+)?$"),
        integerTestExpression = new RegExp("^\\d+(\\,\\d{3})*$");

    // + converters.float
    converters.float = {
        "formatter": function (value, format) {
            var options = converters.float.defaultOptions;
            
            if (value === undefined || value === null) {
                return "";
            }
            
            if (format === undefined || format === null) {
                format = "";
            }

            value = value.toString();
            
            value = value.replace(".", options.decimalSeparator);
            
            if (format.indexOf(options.thousandsSeparator) !== -1) {
                value = formatting.addThousandsSeparator(value, options.thousandsSeparator, options.decimalSeparator);
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

    converters.float.options = {
        "decimalSeparator": ".",
        "thousandsSeparator": ","
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

    converters.integer.options = {
        "decimalSeparator": ".",
        "thousandsSeparator": ","
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
