(function () {
    "use strict";

    var
        defaultNumericHelper = new valerie.NumericHelper(),
        dateExpression = /^(\d\d?)(?:\-|\/|\.)(\d\d?)(?:\-|\/|\.)(\d\d\d\d)$/,
        emailExpression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    // Shortcuts.
        pad = valerie.formatting.pad,
        converters = valerie.converters = valerie.converters || {};

    /**
     * A converter for dates.<br/>
     * By default date strings in <code>dd/mm/yyyy</code> or <code>dd-mm-yyyy</code> formats can be parsed.<br/>
     * By setting <b>valerie.converters.date.monthBeforeDate</b> to <code>true</code> date strings in
     * <code>mm/dd/yyyy</code> or <code>mm-dd-yyyy</code> can be parsed.</br>
     * <i>[full]</i>
     * @name valerie.converters~date
     * @type valerie.IConverter
     */
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
        },
        /**
         * Controls whether dd/mm/yyyy or mm/dd/yyyy are acceptable date formats.
         * @name valerie.converters.date#monthBeforeDate
         * @type {boolean}
         */
        "monthBeforeDate": false
    };

    /**
     * The default numerical helper used by converters.
     * @type {valerie.NumericHelper}
     */
    converters.defaultNumericHelper = defaultNumericHelper;

    /**
     * A converter for currency values with only major units, for example: <code>£1,093</code>, <code>$1093</code>,
     * <code>1.093</code>.<br/>
     * Currency string values are parsed into <code>float</code> values.<br/>
     * <b>valerie.converters.currency.numericHelper</b> is used to parse and format values; this is defaulted to
     * <b>valerie.converters.defaultNumericHelper</b>.<br/>
     * <i>[full]</i>
     * @name valerie.converters~currencyMajor
     * @type valerie.IConverter
     */
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

    /**
     * A converter for currency values with major and optionally minor units, for example: <code>£93</code>,
     * <code>$93.22</code>, <code>1,093.00</code>, <code>1.293,22</code>.<br/>
     * Currency string values are parsed into <code>float</code> values.<br/>
     * <b>valerie.converters.currency.numericHelper</b> is used to parse and format values; this is defaulted to
     * <b>valerie.converters.defaultNumericHelper</b>.<br/>
     * <i>[full]</i>
     * @name valerie.converters~currencyMajorMinor
     * @type valerie.IConverter
     */
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

    /**
     * The default numerical helper used by converters that convert currency values.
     * @type {valerie.NumericHelper}
     */
    converters.currency = { "numericHelper": defaultNumericHelper };

    /**
     * A converter for e-mail addresses.<br/>
     * <i>[full]</i>
     * @name valerie.converters~email
     * @type valerie.IConverter
     */
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

    /**
     * A converter for non-integer number values.<br/>
     * <i>[full]</i>
     * @name valerie.converters~float
     * @type valerie.IConverter
     */
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

    /**
     * The default numerical helper used by the <b>valerie.converters.float</b> converter.
     * @type {valerie.NumericHelper}
     */
    converters.float.numericHelper = defaultNumericHelper;

    /**
     * A converter for integer values.<br/>
     * <i>[full]</i>
     * @name valerie.converters~integer
     * @type valerie.IConverter
     */
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

    /**
     * The default numerical helper used by the <b>valerie.converters.integer</b> converter.
     * @type {valerie.NumericHelper}
     */
    converters.integer.numericHelper = defaultNumericHelper;

    /**
     * A converter for Javascript Number values.<br/>
     * <i>[full]</i>
     * @name valerie.converters~number
     * @type valerie.IConverter
     */
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
