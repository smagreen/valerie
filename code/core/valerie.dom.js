// valerie.dom
// - utilities for working with the document object model
// - used by other parts of the valerie library

/// <reference path="valerie.js"/>

/*jshint eqnull: true */
/*global valerie: false */

(function () {
    "use strict";

    var dom = valerie.dom = valerie.dom || {},
        classNamesSeparatorExpression = /\s+/g,
        trimWhitespaceExpression = /^\s+|\s+$/g;

    // + dom.classNamesStringToDictionary
    // - builds and returns a dictionary of true values keyed on the CSS class names found in the given string
    dom.classNamesStringToDictionary = function (classNames) {
        var array,
            dictionary = {},
            index;

        if (classNames == null) {
            return dictionary;
        }

        classNames = classNames.replace(trimWhitespaceExpression, "");

        if(classNames.length === 0) {
            return dictionary;
        }

        array = classNames.split(classNamesSeparatorExpression);

        for (index = 0; index < array.length; index++) {
            dictionary[array[index]] = true;
        }

        return dictionary;
    };

    // + dom.classNamesDictionaryToString
    // - builds and returns a CSS class names string using the keys in the given dictionary for true values
    dom.classNamesDictionaryToString = function (dictionary) {
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

    // + setElementVisibility
    // - sets the visibility of the given DOM element
    dom.setElementVisibility = function (element, newVisibility) {
        var currentVisibility = (element.style.display !== "none");
        if (currentVisibility === newVisibility) {
            return;
        }

        element.style.display = (newVisibility) ? "" : "none";
    };
})();
