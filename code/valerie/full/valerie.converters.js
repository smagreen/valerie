// valerie.converters
// - additional converters

/// <reference path="../core/valerie.js"/>
/// <reference path="../core/valerie.formatting.js"/>
/// <reference path="valerie.numericHelper.js"/>

/*jshint eqnull: true */
/*global valerie: false */

(function () {
    "use strict";

    var pad = valerie.formatting.pad,
        converters = valerie.converters = valerie.converters || {},
        defaultNumericHelper = new valerie.NumericHelper(),
        dateExpression = /^(\d\d?)(?:\-|\/)(\d\d?)(?:\-|\/)(\d\d\d\d)$/,
        emailExpression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    // + converters.date
    converters.date = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            var firstPart,
                secondPart;
            
            if (converters.date.monthBeforeDate) {
                firstPart = value.getMonth() + 1;
                secondPart = value.getDate();
            } else {
                firstPart = value.getDate();
                secondPart = value.getMonth() + 1;
            }
            
            return pad(firstPart, "0", 2) + "/" + pad(secondPart, "0", 2) + "/" + value.getFullYear();
        },
        "parse": function (value) {
            if (value == null) {
                return null;
            }

            var matches = value.match(dateExpression);

            if (matches == null) {
                return null;
            }

            var firstPart = parseInt(matches[1], 10),
                secondPart = parseInt(matches[2], 10),
                date,
                month,
                year = parseInt(matches[3], 10);

            if (converters.date.monthBeforeDate) {
                date = secondPart;
                month = firstPart;
            } else {
                date = firstPart;
                month = secondPart;
            }

            month--;

            value = new Date(year, month, date);

            if (value.getFullYear() !== year || value.getMonth() !== month || value.getDate() !== date) {
                return null;
            }

            return value;
        }
    };

    converters.date.monthBeforeDate = false;

    // + converters.defaultNumericHelper
    converters.defaultNumericHelper = defaultNumericHelper;

    // + converters.currencyMajor
    converters.currencyMajor = {
        "format": function (value, format) {
            return converters.currency.numericHelper.format(value, format);
        },
        "parse": function (value) {
            var numericHelper = converters.currency.numericHelper;

            if (!numericHelper.isCurrencyMajor(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    // + converters.currencyMajorMinor
    converters.currencyMajorMinor = {
        "format": function (value, format) {
            return converters.currency.numericHelper.format(value, format);
        },
        "parse": function (value) {
            var numericHelper = converters.currency.numericHelper;

            if (!numericHelper.isCurrencyMajorMinor(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    converters.currency = { "numericHelper": defaultNumericHelper };

    // + converters.email
    converters.email = {
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
            
            if (!emailExpression.test(value)) {
                return null;
            }

            return value.toLowerCase();
        }
    };

    // + converters.float
    converters.float = {
        "format": function (value, format) {
            return converters.float.numericHelper.format(value, format);
        },
        "parse": function (value) {
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
        "format": function (value, format) {
            return converters.integer.numericHelper.format(value, format);
        },
        "parse": function (value) {
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
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parse": function (value) {
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
