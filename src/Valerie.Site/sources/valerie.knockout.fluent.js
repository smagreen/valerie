// valerie.knockout.fluent
// - additional functions for the PropertyValidationState prototype for specifying converts and rules in a fluent manner
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.converters.js"/>
/// <reference path="valerie.rules.js"/>
/// <reference path="valerie.knockout.js"/>

/*global ko: false, valerie: false */

(function() {
    "use strict";

    var prototype = valerie.knockout.PropertyValidationState.prototype,
        converters = valerie.converters,
        rules = valerie.rules;

    // + between
    prototype.between = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        this.settings.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);

        return this;
    };

    // + number
    prototype.number = function() {
        this.settings.converter = converters.number;

        return this;
    };
})();
