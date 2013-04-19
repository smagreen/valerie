///#source 1 1 ../bundles/valerie.license.js
"valerie (c) 2013 egrove Ltd. License: MIT (http://www.opensource.org/licenses/mit-license.php)";
///#source 1 1 ../sources/valerie.core.js
// valerie.core
// - the core namespaces, objects and utility functions
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

(function () {
    // ReSharper disable AssignToImplicitGlobalInFunctionScope
    if (typeof valerie === "undefined") {
        valerie = {};
    }

    valerie = valerie || {};
    // ReSharper restore AssignToImplicitGlobalInFunctionScope

    valerie.converters = valerie.converters || {};
    valerie.rules = valerie.rules || {};
    valerie.utils = valerie.utils || {};
})();

(function () {
    "use strict";

    var utils = valerie.utils;

    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };

    utils.formatString = function (format, replacements) {
        if (replacements === undefined || replacements === null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];
            return typeof replacement === "string" ? replacement : match;
        });
    };

    utils.isArray = function (value) {
        return {}.toString.call(value) === "[object Array]";
    };

    utils.isFunction = function (value) {
        if (value === undefined || value === null) {
            return false;
        }

        return (typeof value === "function");
    };

    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

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

    utils.isMissing = function (value) {
        if (value === undefined || value === null) {
            return true;
        }

        if (value.length === 0) {
            return true;
        }

        return false;
    };
})();

(function () {
    "use strict";

    var converters = valerie.converters;

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
})();

(function () {
    "use strict";

    var rules = valerie.rules;

    rules.passThrough = {
        "test": function () {
            return rules.successfulTestResult;
        }
    };

    rules.successfulTestResult = {
        "failed": false,
        "failureMessage": ""
    };
})();

///#source 1 1 ../sources/valerie.converters.js
// valerie.converters
// - general purpose converters for use with valerie
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
/// <reference path="valerie.core.js"/>

(function () {
    "use strict";

    var converters = valerie.converters;

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

            // ToDo: Change this very noddy, permissive implementation.
            var parsedValue = parseInt(value, 10);

            if (isNaN(parsedValue)) {
                return undefined;
            }

            return parsedValue;
        }
    };

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
// - general purpose rules for use with valerie
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
// <reference path="valerie.core.js"/>

(function () {
    "use strict";

    var rules = valerie.rules,
        utils = valerie.utils;

    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "2 or 3 arguments expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.options = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormatForMinimumOnly": "The value must be no less than {minimum}.",
        "failureMessageFormatForMaximumOnly": "The value must be no greater than {maximum}.",
        "failureMessageFormatForRange": "The value must be between {minimum} and {maximum}.",
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
                    "maximum": this.options.valueFormatter(maximum),
                    "minimum": this.options.valueFormatter(minimum),
                    "value": this.options.valueFormatter(value)
                });

            return {
                "failed": true,
                "failureMessage": failureMessage
            };
        }
    };

    // ToDo: During (Range for dates and times).
})();

