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
