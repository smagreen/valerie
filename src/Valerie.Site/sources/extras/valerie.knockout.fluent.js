﻿// valerie.knockout.fluent
// - additional functions for the PropertyValidationState prototype for specifying converts and rules in a fluent manner
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.knockout.js"/>
/// <reference path="valerie.converters.js"/>
/// <reference path="valerie.rules.js"/>

/*global ko: false, valerie: false */

(function () {
    "use strict";

    var prototype = valerie.knockout.PropertyValidationState.prototype,
        converters = valerie.converters,
        rules = valerie.rules;

    // + between
    prototype.between = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        this.settings.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);

        return this;
    };

    // + maximumOf
    prototype.maximumOf = function (maximumValueOrFunction, options) {
        this.settings.rule = new rules.Range(undefined, maximumValueOrFunction, options);

        return this;
    };

    // + minimumOf
    prototype.minimumOf = function (minimumValueOrFunction, options) {
        this.settings.rule = new rules.Range(minimumValueOrFunction, undefined, options);

        return this;
    };
    
    // + number
    prototype.number = function () {
        this.settings.converter = converters.number;

        return this;
    };
})();

