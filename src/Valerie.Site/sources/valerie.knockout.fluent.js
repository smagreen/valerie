// valerie.knockout.fluent
// - additional functions for defining validation options on ko.observables and ko.computeds
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
/// <reference path="valerie.core.js"/>
/// <reference path="valerie.converters.js"/>
/// <reference path="valerie.rules.js"/>
/// <reference path="valerie.knockout.core.js"/>

(function () {
    "use strict";

    var converters = valerie.converters,
        prototype = valerie.knockout.ValidationState.prototype,
        rules = valerie.rules;

    prototype.between = function (minimumValueOrFunction, maximumValueOrFunction) {
        this.options.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction);
        return this;
    };

    prototype.integer = function () {
        this.options.converter = converters.integer;
        return this;
    };
})();