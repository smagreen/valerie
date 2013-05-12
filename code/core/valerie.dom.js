// valerie.dom
// - utilities for working with the document object model
// - used by other parts of the valerie library

(function () {
    "use strict";

    var classNamesSeparatorExpression = /\s+/g,
        trimWhitespaceExpression = /^\s+|\s+$/g;

    /**
     * Builds and returns a dictionary of true values, keyed on the CSS class-names found in the given string.
     * @static
     * @param {string} classNames the CSS class-names
     * @returns {{}} the dictionary
     */
    valerie.dom.classNamesStringToDictionary = function (classNames) {
        var array,
            dictionary = {},
            index;

        if (classNames == null) {
            return dictionary;
        }

        classNames = classNames.replace(trimWhitespaceExpression, "");

        if (classNames.length === 0) {
            return dictionary;
        }

        array = classNames.split(classNamesSeparatorExpression);

        for (index = 0; index < array.length; index++) {
            dictionary[array[index]] = true;
        }

        return dictionary;
    };

    /**
     * Builds and returns a CSS class-names string using the keys in the given dictionary which have true values.
     * @static
     * @param {{}} dictionary the dictionary of CSS class-names
     * @returns {string}
     */
    valerie.dom.classNamesDictionaryToString = function (dictionary) {
        var name,
            array = [];

        for (name in dictionary) {
            if (dictionary.hasOwnProperty(name)) {
                if (dictionary[name]) {
                    array.push(name);
                }
            }
        }

        array.sort();

        return array.join(" ");
    };

    /**
     * Sets the visibility of the given HTML element.
     * @static
     * @param {HTMLElement} element the element to set the visibility of
     * @param {boolean} newVisibility
     */
    valerie.dom.setElementVisibility = function (element, newVisibility) {
        var currentVisibility = (element.style.display !== "none");
        if (currentVisibility === newVisibility) {
            return;
        }

        element.style.display = (newVisibility) ? "" : "none";
    };
})();