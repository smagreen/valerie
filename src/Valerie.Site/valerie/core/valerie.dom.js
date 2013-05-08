// valerie.dom
// - utilities for working with the document object model
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*jshint eqnull: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var dom = valerie.dom = valerie.dom || {},
        classNamesSeparatorExpression = /\s+/g,
        trimWhitespaceExpression = /^\s+|\s+$/g;

    // + dom.classNamesStringToDictionary
    dom.classNamesStringToDictionary = function (classNames) {
        var array,
            dictionary = {},
            index;

        if (classNames == null) {
            return dictionary;
        }

        classNames = classNames.replace(trimWhitespaceExpression, "");

        array = classNames.split(classNamesSeparatorExpression);

        for (index = 0; index < array.length; index++) {
            dictionary[array[index]] = true;
        }

        return dictionary;
    };

    // + dom.classNamesDictionaryToString
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
