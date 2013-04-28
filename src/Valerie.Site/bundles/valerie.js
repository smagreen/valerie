///#source 1 1 ../bundles/valerie.license.js
"valerie (c) 2013 egrove Ltd. License: MIT (http://www.opensource.org/licenses/mit-license.php)";
///#source 1 1 ../sources/valerie.validationResult.js
// valerie.validationResult
// - defines the ValidationResult constructor function
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {

    "use strict";

    // + ValidationResult
    // - the result of a validation test
    valerie.ValidationResult = function (failed, failureMessage) {
        this.failed = failed;
        this.failureMessage = failureMessage;
    };

    valerie.ValidationResult.success = new valerie.ValidationResult(false, "");
})();

///#source 1 1 ../sources/valerie.utils.js
// valerie.utils
// - general purpose utilities
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var utils = valerie.utils = valerie.utils || {};

    // + utils.asArray
    utils.asArray = function (valueOrArray) {
        if (utils.isArray(valueOrArray)) {
            return valueOrArray;
        }

        return [valueOrArray];
    };

    // + utils.asFunction
    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };
    
    // + utils.isArray
    utils.isArray = function (value) {
        return {}.toString.call(value) === "[object Array]";
    };

    // + utils.isArrayOrObject
    utils.isArrayOrObject = function(value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

    // + utils.isFunction
    utils.isFunction = function (value) {
        if (value === undefined || value === null) {
            return false;
        }

        return (typeof value === "function");
    };

    // + utils.isMissing
    utils.isMissing = function (value) {
        if (value === undefined || value === null) {
            return true;
        }

        if (value.length === 0) {
            return true;
        }

        return false;
    };

    // + utils.isObject
    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }
        
        if(utils.isArray(value)) {
            return false;
        }

        return typeof value === "object";
    };

    // + utils.mergeOptions
    utils.mergeOptions = function (defaultOptions, options) {
        var mergedOptions = {},
            name;

        if (defaultOptions === undefined || defaultOptions === null) {
            defaultOptions = {};
        }

        if (options === undefined || options === null) {
            options = {};
        }

        for (name in defaultOptions) {
            if (defaultOptions.hasOwnProperty(name)) {
                mergedOptions[name] = defaultOptions[name];
            }
        }

        for (name in options) {
            if (options.hasOwnProperty(name)) {
                mergedOptions[name] = options[name];
            }
        }

        return mergedOptions;
    };
})();

///#source 1 1 ../sources/valerie.formatting.js
// valerie.formatting
// - general purpose formatting functions
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function() {
    "use strict";

    var formatting = valerie.formatting = valerie.formatting || {};

    // + formatting.addThousandsSeparator
    formatting.addThousandsSeparator = function(numberString, thousandsSeparator, decimalSeparator) {
        var wholeAndFractionalParts = numberString.toString().split(decimalSeparator),
            wholePart = wholeAndFractionalParts[0];

        wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        wholeAndFractionalParts[0] = wholePart;

        return wholeAndFractionalParts.join(decimalSeparator);
    };

    // + format.replacePlaceholders
    formatting.replacePlaceholders = function(format, replacements) {
        if (replacements === undefined || replacements === null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function(match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement === undefined || replacement === null) {
                return match;
            }

            return replacement.toString();
        });
    };
})();

///#source 1 1 ../sources/valerie.passThrough.js
// valerie.passThrough
// - the pass through converter and rule
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function() {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        rules = valerie.rules = valerie.rules || {};

    // + converters.passThrough
    converters.passThrough = {
        "formatter": function(value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function(value) {
            return value;
        }
    };

    // + rules.PassThrough
    rules.PassThrough = function() {
        this.settings = {};
    };

    rules.PassThrough.prototype = {
        "test": function() {
            return rules.successfulTestResult;
        }
    };
})();

///#source 1 1 ../sources/valerie.converters.js
// valerie.converters
// - general purpose converters
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {};

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

            return Number(value);
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

///#source 1 1 ../sources/valerie.rules.js
// valerie.rules
// - general purpose rules
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.validationResult.js"/>
/// <reference path="valerie.passThrough.js"/>
/// <reference path="valerie.utils.js"/>

/*global valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var ValidationResult = valerie.ValidationResult,
// ReSharper restore InconsistentNaming
        rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils,
        formatting = valerie.formatting;

    // ToDo: During (Range for dates and times).

    // + rules.Range
    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "2 or 3 arguments expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.settings = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormatForMinimumOnly": "The value must be no less than {minimum}.", /*resource*/
        "failureMessageFormatForMaximumOnly": "The value must be no greater than {maximum}.", /*resource*/
        "failureMessageFormatForRange": "The value must be between {minimum} and {maximum}.", /*resource*/
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function (value) {
            var failureMessage,
                failureMessageFormat = this.settings.failureMessageFormatForRange,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum !== undefined && maximum !== null,
                haveMinimum = minimum !== undefined && minimum !== null,
                haveValue = value !== undefined && value !== null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return ValidationResult.success;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return ValidationResult.success;
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "maximum": this.settings.valueFormatter(maximum, this.settings.valueFormat),
                    "minimum": this.settings.valueFormatter(minimum, this.settings.valueFormat),
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return {
                "failed": true,
                "failureMessage": failureMessage
            };
        }
    };
})();


