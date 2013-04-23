///#source 1 1 ../bundles/valerie.license.js
"valerie (c) 2013 egrove Ltd. License: MIT (http://www.opensource.org/licenses/mit-license.php)";
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

    // + utils.formatString
    utils.formatString = function (format, replacements) {
        if (replacements === undefined || replacements === null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement === undefined || replacement === null) {
                return match;
            }

            return replacement.toString();
        });
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

    // + converters.integer
    converters.integer = {
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

            // ToDo: Change this very simple, permissive implementation.
            var parsedValue = parseInt(value, 10);

            if (isNaN(parsedValue)) {
                return undefined;
            }

            return parsedValue;
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

///#source 1 1 ../sources/valerie.rules.js
// valerie.rules
// - general purpose rules
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.utils.js"/>

/*global valerie: false */
if (typeof valerie === "undefined" || !valerie.utils) throw "valerie.utils is required.";

(function () {
    "use strict";

    var rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils;

    // ToDo: During (Range for dates and times).

    // + rules.PassThrough
    rules.PassThrough = function() {
        this.options = {};
    };

    rules.PassThrough.prototype = {
        "test": function() {
            return rules.successfulTestResult;
        }
    };

    // + rules.Range
    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "2 or 3 arguments expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.options = utils.mergeOptions(rules.Range.defaultOptions, options);
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
                failureMessageFormat = this.options.failureMessageFormatForRange,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum !== undefined && maximum !== null,
                haveMinimum = minimum !== undefined && minimum !== null,
                haveValue = value !== undefined && value !== null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return rules.successfulTestResult;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.options.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.options.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return rules.successfulTestResult;
            }

            failureMessage = utils.formatString(
                failureMessageFormat, {
                    "maximum": this.options.valueFormatter(maximum, this.options.valueFormat),
                    "minimum": this.options.valueFormatter(minimum, this.options.valueFormat),
                    "value": this.options.valueFormatter(value, this.options.valueFormat)
                });

            return {
                "failed": true,
                "failureMessage": failureMessage
            };
        }
    };

    rules.successfulTestResult = {
        "failed": false,
        "failureMessage": ""
    };
})();

