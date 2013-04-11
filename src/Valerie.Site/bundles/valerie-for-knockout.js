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

