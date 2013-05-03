// valerie.converters.numeric
// - converters for numeric values
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.numericHelper.js"/>

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {};

    // + converters.defaultNumericHelper
    converters.defaultNumericHelper = new valerie.NumericHelper(".", ",", "$", 2);

    // + converters.currencyMajor
    converters.currencyMajor = {
        "formatter": function (value, format) {
            var numericHelper = converters.currency.numericHelper || converters.defaultNumericHelper;

            return numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.currency.numericHelper || converters.defaultNumericHelper;

            if (!numericHelper.isCurrencyMajor(value)) {
                return undefined;
            }

            value = numericHelper.normaliseString(value);

            return Number(value);
        }
    };

    // + converters.currencyMajorMinor
    converters.currencyMajorMinor = {
        "formatter": function (value, format) {           
            var numericHelper = converters.currency.numericHelper || converters.defaultNumericHelper;

            return numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.currency.numericHelper || converters.defaultNumericHelper;

            if (!numericHelper.isCurrencyMajorMinor(value)) {
                return undefined;
            }

            value = numericHelper.normaliseString(value);

            return Number(value);
        }
    };

    converters.currency = { "numericHelper": undefined };

    // + converters.float
    converters.float = {
        "formatter": function (value, format) {
            var numericHelper = converters.float.numericHelper || converters.defaultNumericHelper;

            return numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.float.numericHelper || converters.defaultNumericHelper;

            if (!numericHelper.isFloat(value)) {
                return undefined;
            }

            value = numericHelper.normaliseString(value);

            return Number(value);
        }
    };

    converters.float.numericHelper = undefined;

    // + converters.integer
    converters.integer = {
        "formatter": function (value, format) {
            var numericHelper = converters.integer.numericHelper || converters.defaultNumericHelper;

            return numericHelper.format(value, format);
        },
        "parser": function (value) {
            var numericHelper = converters.integer.numericHelper || converters.defaultNumericHelper;

            if (!numericHelper.isInteger(value)) {
                return undefined;
            }

            value = numericHelper.normaliseString(value);

            return Number(value);
        }
    };

    converters.integer.numericHelper = undefined;

    // + converters.number
    converters.number = {
        "formatter": function (value) {

            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            value = Number(value);

            if (isNaN(value)) {
                return undefined;
            }

            return value;
        }
    };
})();
