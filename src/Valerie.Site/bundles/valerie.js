///#source 1 1 ../sources/valerie.core.js
// valerie.core
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie:true */

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
}
)();

(function () {
    "use strict";

    var utils = valerie.utils;

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
}
)();

///#source 1 1 ../sources/valerie.converters.js
// valerie.converters
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
                return NaN;
            }

            // ToDo: Change this very noddy, permissive implementation.
            return parseInt(value, 10);
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
                return "";
            }

            return value;
        }
    };
}
)();

///#source 1 1 ../sources/valerie.rules.js
// valerie.rules
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
/// <reference path="valerie.core.js"/>

(function () {
    "use strict";

    var rules = valerie.rules,
        utils = valerie.utils;

    rules.successfulTestResult = {
        "failed": false,
        "failedMessage": ""
    };

    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        this.minimum = (typeof minimumValueOrFunction === "function") ?
            minimumValueOrFunction :
            function () { return minimumValueOrFunction; };
        
        this.maximum = (typeof maximumValueOrFunction === "function") ?
            maximumValueOrFunction :
            function () { return maximumValueOrFunction; };

        this.options = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failedMessageFormatWithMinimumOnly": "The value must be no less than {minimum}.",
        "failedMessageFormatWithMaximumOnly": "The value must be no greater than {maximum}.",
        "failedMessageFormatForRange": "The value must be between {minimum} and {maximum}.",
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function(value) {
            var failed = true,
                failedMessage,
                failedMessageFormat = options.failedMessageFormatForRange,
                minimum = this.minimum(),
                maximum = this.maximum();

            if ((minimum === undefined || minimum === null) && (maximum === undefined || maximum === null)) {
                return rules.successfulTestResult;
            }

            if (minimum === undefined || minimum === null) {
                failedMessageFormat = options.failedMessageFormatWithMaximumOnly;
            }
            
            if (maximum === undefined || maximum === null) {
                failedMessageFormat = options.failedMessageFormatWithMinimumOnly;
            }
            
            if (value !== undefined && value !== null) {
                failedMessage = utils.formatString(
                    this.options.failedMessageFormat, {
                        "maximum": this.options.valueFormatter(maximum),
                        "value": this.options.valueFormatter(value)
                    });

                return {
                    "failed": true,
                    "failedMessage": failedMessage
                };
            }

            return rules.successfulTestResult;
        }
    };
    
    // ToDo: After
    // ToDo: Before
    // ToDo: Minimum
    // ToDo: Range

})();
