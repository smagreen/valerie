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

    /**
     * A helper for parsing and formatting numeric values.<br/>
     * <i>[full]</i>
     * @constructor
     */
    valerie.NumericHelper = function () {
    };

    valerie.NumericHelper.prototype = {
        /**
         * Initialises the helper.<br/>
         * <i>[fluent]</i>
         * @param {string} decimalSeparator the character or string to use as the decimal separator
         * @param {string} thousandsSeparator the character or string to use as the thousands separator
         * @param {string} currencySign the character or string to use as the currency sign
         * @param {number} currencyMinorUnitPlaces the number of decimal places to use when parsing and formatting the
         * currency's minor units
         * @returns {valerie.NumericHelper}
         */
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
        /**
         * Adds thousands separators to the given numeric string.
         * @param {string} numericString the numeric string to add separators to
         * @return {string} a numeric string with thousands separators
         */
        "addThousandsSeparator": function (numericString) {
            var settings = this.settings;

            return formatting.addThousandsSeparator(numericString, settings.thousandsSeparator,
                settings.decimalSeparator);
        },
        /**
         * Formats the given numeric value as a string.<br/>
         * Permitted format strings are:
         * <ul>
         *     <li><code>C,.c</code></li>
         *     <li><code>C,.1</code></li>
         *     <li><code>C,.n</code></li>
         *     <li><code>C.c</code></li>
         *     <li><code>C.1</code></li>
         *     <li><code>C.n</code></li>
         *     <li><code>.c</code></li>
         *     <li><code>.1</code></li>
         *     <li><code>.n</code></li>
         * </ul>
         * The formatting characters have the following directives:
         * <ul>
         *     <li><code>C</code> - include the currency sign in the formatted string</li>
         *     <li><code>,</code> - include thousands separators in the formatted string</li>
         *     <li><code>.</code> - include the decimal separator in the formatted string</li>
         *     <li><code>.c</code> - include the default number of digits after the decimal separator</li>
         *     <li><code>.1</code> - include 1 digit after the decimal separator</li>
         *     <li><code>.n</code> - include [n] digits after the decimal separator</li>
         * </ul>
         * @param {number} value the value to format
         * @param {string} format the format to use
         * @return {string} the formatted string
         */
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
                //noinspection JSValidateTypes
                value = value.toFixed(numberOfDecimalPlaces);
            } else {
                value = value.toString();
            }

            //noinspection JSUnresolvedFunction
            value = value.replace(".", settings.decimalSeparator);

            if (formatOptions.includeThousandsSeparator) {
                //noinspection JSValidateTypes
                value = this.addThousandsSeparator(value);
            }

            return (negative ? "-" : "") +
                (formatOptions.includeCurrencySign ? settings.currencySign : "") +
                value;
        },
        /**
         * Informs whether the given numeric string represents a currency value with major units only.
         * @param {string} numericString the numeric string to test
         * @return {boolean} <code>true</code> if the given numeric string represents a currency value,
         * <code>false</code> otherwise
         */
        "isCurrencyMajor": function (numericString) {
            return this.expressions.currencyMajor.test(numericString);
        },
        /**
         * Informs whether the given numeric string represents a currency value with major units and optionally minor units.
         * @param {string} numericString the numeric string to test
         * @return {boolean} <code>true</code> if the given numeric string represents a currency value,
         * <code>false</code> otherwise
         */
        "isCurrencyMajorMinor": function (numericString) {
            return this.expressions.currencyMajorMinor.test(numericString);
        },
        /**
         * Informs whether the given numeric string represents a non-integer numeric value.
         * @param {string} numericString the numeric string to test
         * @return {boolean} <code>true</code> if the given numeric string represents a non-integer numeric value,
         * <code>false</code> otherwise
         */
        "isFloat": function (numericString) {
            return this.expressions.float.test(numericString);
        },
        /**
         * Informs whether the given numeric string represents an integer value.
         * @param {string} numericString the numeric string to test
         * @return {boolean} <code>true</code> if the given numeric string represents a integer value,
         * <code>false</code> otherwise
         */
        "isInteger": function (numericString) {
            return this.expressions.integer.test(numericString);
        },
        /**
         * Attempts to parse the given numeric string as a number value. The string is unformatted first.
         * @param numericString
         * @returns {NaN|number}
         */
        "parse": function (numericString) {
            numericString = this.unformat(numericString);

            return Number(numericString);
        },
        /**
         * Unformats a numeric string; removes currency signs, thousands separators and normalises decimal separators.
         * @param {string} numericString the numeric string to unformat
         * @returns {string} the unformatted string
         */
        "unformat": function (numericString) {
            var settings = this.settings;

            numericString = numericString.replace(settings.currencySign, "");
            numericString = numericString.replace(settings.thousandsSeparator, "");
            numericString = numericString.replace(settings.decimalSeparator, ".");

            return numericString;
        }
    };
})();
