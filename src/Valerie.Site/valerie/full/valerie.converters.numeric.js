// valerie.converters.numeric
// - converters for numeric values
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.numericHelper.js"/>

/*jshint eqnull: true */
/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        defaultNumericHelper = new valerie.NumericHelper();

    // + converters.defaultNumericHelper
    converters.defaultNumericHelper = defaultNumericHelper;

    // + converters.currencyMajor
    converters.currencyMajor = {
        "formatter": function (value, format) {
            return converters.currency.numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.currency.numericHelper;

            if (!numericHelper.isCurrencyMajor(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    // + converters.currencyMajorMinor
    converters.currencyMajorMinor = {
        "formatter": function (value, format) {
            return converters.currency.numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.currency.numericHelper;

            if (!numericHelper.isCurrencyMajorMinor(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    converters.currency = { "numericHelper": defaultNumericHelper };

    // + converters.float
    converters.float = {
        "formatter": function (value, format) {
            return converters.float.numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.float.numericHelper;

            if (!numericHelper.isFloat(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    converters.float.numericHelper = defaultNumericHelper;

    // + converters.integer
    converters.integer = {
        "formatter": function (value, format) {
            return converters.integer.numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.integer.numericHelper;

            if (!numericHelper.isInteger(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    converters.integer.numericHelper = defaultNumericHelper;

    // + converters.number
    converters.number = {
        "formatter": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            if (value == null) {
                return null;
            }

            value = Number(value);

            if (isNaN(value)) {
                return null;
            }

            return value;
        }
    };
})();
