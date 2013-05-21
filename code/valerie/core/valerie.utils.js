(function () {
    "use strict";

    /**
     * Contains general purpose utilities.
     * @namespace valerie.utils
     */
    valerie.utils = {};

    // Shortcuts.
    var utils = valerie.utils;

    /**
     * Creates a function that returns the given value as an array of one item, or simply returns the given value if it
     * is already an array.
     * @memberof valerie.utils
     * @param {*|Array} [valueOrArray] the value or function
     * @return {Array} a newly created array, or the array passed in
     */
    utils.asArray = function (valueOrArray) {
        if (utils.isArray(valueOrArray)) {
            return valueOrArray;
        }

        return [valueOrArray];
    };

    /**
     * Creates a function that returns the given value, or simply returns the given value if it is already a function.
     * @memberof valerie.utils
     * @param {*|function} [valueOrFunction] the value or function
     * @return {function} a newly created function, or the function passed in
     */
    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };

    /**
     * Tests whether the given value is an array.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an array
     */
    utils.isArray = function (value) {
        //noinspection JSValidateTypes
        return {}.toString.call(value) === "[object Array]";
    };

    /**
     * Tests whether the given value is an array or object.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an array or an object
     */
    utils.isArrayOrObject = function (value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

    /**
     * Tests whether the given value is a function.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is a function
     */
    utils.isFunction = function (value) {
        if (value == null) {
            return false;
        }

        return (typeof value === "function");
    };

    /**
     * Tests whether the given value is "missing".
     * <code>undefined</code>, <code>null</code>, an empty string or an empty array are considered to be "missing".
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the value is missing
     */
    utils.isMissing = function (value) {
        if (value == null) {
            return true;
        }

        if(utils.isString(value)) {
            return value.length === 0;
        }

        return false;
    };

    /**
     * Tests whether the given value is an object.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an object
     */
    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }

        if (utils.isArray(value)) {
            return false;
        }

        return typeof value === "object";
    };

    /**
     * Tests whether the give value is a string.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is a string
     */
    utils.isString = function (value) {
        //noinspection JSValidateTypes
        return {}.toString.call(value) === "[object String]";
    };

    /**
     * Merges the given default options with the given options.
     * <ul>
     *     <li>either parameter can be omitted and a clone of the other parameter will be returned</li>
     *     <li>the merge is shallow</li>
     *     <li>array properties are shallow cloned</li>
     * </ul>
     * @memberof valerie.utils
     * @param {{}} defaultOptions the default options
     * @param {{}} options the options
     * @return {{}} the merged options
     */
    utils.mergeOptions = function (defaultOptions, options) {
        var mergedOptions = {},
            name,
            value;

        if (defaultOptions == null) {
            defaultOptions = {};
        }

        if (options == null) {
            options = {};
        }

        for (name in defaultOptions) {
            if (defaultOptions.hasOwnProperty(name)) {
                value = defaultOptions[name];

                if (utils.isArray(value)) {
                    value = value.slice(0);
                }

                mergedOptions[name] = value;
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
