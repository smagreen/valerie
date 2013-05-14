// valerie.knockout.fluent.converters.en-gb
// - additional functions for the PropertyValidationState prototype for fluently specifying converters

/// <reference path="../../core/valerie.js"/>
/// <reference path="../../core/valerie.knockout.js"/>
/// <reference path="valerie.converters.en-gb.js"/>

/*jshint eqnull: true */
/*global valerie: false */

(function () {
    "use strict";

    var converters = valerie.converters,
        prototype = valerie.knockout.PropertyValidationState.prototype;

    // + postcode
    prototype.postcode = function () {
        this.settings.converter = converters.postcode;

        return this;
    };
})();
