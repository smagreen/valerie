// valerie.numericHelper
// - helper for parsing and formatting numeric values
// - used by other parts of the valerie library

(function () {
    "use strict";

    var formatting = valerie.formatting,
        formatStringAsOptions = function (numericHelper, format) {
            var includeCurrencySign = format.indexOf("C") > -1,
                includeThousandsSeparator = format.indexOf(",") > -1,
                decimalPlaceIndex = format.indexOf("."),
                numberOfDecimalPlaces = 0;

            if (decimalPlaceIndex === format.length - 1) {
                numberOfDecimalPlaces = null;
            } else {
                if (decimalPlaceIndex > -1) {
                    if (format.charAt(decimalPlaceIndex + 1) === "c") {
                        numberOfDecimalPlaces = numericHelper.settings.currencyMinorUnitPlaces;
                    } else {
                        numberOfDecimalPlaces = Number(format.substr(decimalPlaceIndex + 1));
                    }
                }
            }

            return {
                "includeCurrencySign": includeCurrencySign,
                "includeThousandsSeparator": includeThousandsSeparator,
                "numberOfDecimalPlaces": numberOfDecimalPlaces
            };
        };

    // + valerie.NumericHelper
    valerie.NumericHelper = function () {
    };

    valerie.NumericHelper.prototype = {
        "init": function (decimalSeparator, thousandsSeparator, currencySign, currencyMinorUnitPlaces) {
            var integerExpression = "\\d+(\\" + thousandsSeparator + "\\d{3})*",
                currencyMajorExpression = "(\\" + currencySign + ")?" + integerExpression,
                currentMajorMinorExpression = currencyMajorExpression + "(\\" +
                    decimalSeparator + "\\d{" + currencyMinorUnitPlaces + "})?",
                floatExpression = integerExpression + "(\\" + decimalSeparator + "\\d+)?";

            this.settings = {
                "decimalSeparator": decimalSeparator,
                "thousandsSeparator": thousandsSeparator,
                "currencySign": currencySign,
                "currencyMinorUnitPlaces": currencyMinorUnitPlaces
            };

            this.expressions = {
                "currencyMajor": new RegExp("^" + currencyMajorExpression + "$"),
                "currencyMajorMinor": new RegExp("^" + currentMajorMinorExpression + "$"),
                "float": new RegExp("^" + floatExpression + "$"),
                "integer": new RegExp("^" + integerExpression + "$")
            };

            return this;
        },
        "addThousandsSeparator": function (numericString) {
            var settings = this.settings;

            return formatting.addThousandsSeparator(numericString, settings.thousandsSeparator,
                settings.decimalSeparator);
        },
        "format": function (value, format) {
            if (value == null) {
                return "";
            }

            if (format == null) {
                format = "";
            }

            var settings = this.settings,
                formatOptions = formatStringAsOptions(this, format),
                numberOfDecimalPlaces = formatOptions.numberOfDecimalPlaces,
                negative = value < 0;

            if (negative) {
                value = -value;
            }

            if (numberOfDecimalPlaces != null) {
                value = value.toFixed(numberOfDecimalPlaces);
            } else {
                value = value.toString();
            }

            value = value.replace(".", settings.decimalSeparator);

            if (formatOptions.includeThousandsSeparator) {
                value = this.addThousandsSeparator(value);
            }

            return (negative ? "-" : "") +
                (formatOptions.includeCurrencySign ? settings.currencySign : "") +
                value;
        },
        "isCurrencyMajor": function (numericString) {
            return this.expressions.currencyMajor.test(numericString);
        },
        "isCurrencyMajorMinor": function (numericString) {
            return this.expressions.currencyMajorMinor.test(numericString);
        },
        "isFloat": function (numericString) {
            return this.expressions.float.test(numericString);
        },
        "isInteger": function (numericString) {
            return this.expressions.integer.test(numericString);
        },
        "parse": function (numericString) {
            numericString = this.unformat(numericString);

            return Number(numericString);
        },
        "unformat": function (numericString) {
            var settings = this.settings;

            numericString = numericString.replace(settings.currencySign, "");
            numericString = numericString.replace(settings.thousandsSeparator, "");
            numericString = numericString.replace(settings.decimalSeparator, ".");

            return numericString;
        }
    };
})();
