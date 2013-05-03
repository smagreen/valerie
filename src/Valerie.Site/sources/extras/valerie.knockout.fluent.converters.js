// valerie.knockout.fluent.converters
// - additional functions for the PropertyValidationState prototype for fluently specifying converters
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.validationResult.js"/>
/// <reference path="../core/valerie.knockout.js"/>
/// <reference path="valerie.converters.numeric.js"/>

/*global ko: false, valerie: false */

(function () {
    "use strict";

    var prototype = valerie.knockout.PropertyValidationState.prototype,
        converters = valerie.converters;

    // + currencyMajor
    prototype.currencyMajor = function () {
        this.settings.converter = converters.currencyMajor;

        // ToDo: Set entry format and value format to different values.
        return this;
    };

    // + currencyMajorMinor
    prototype.currencyMajorMinor = function () {
        var numericHelper = converters.currency.numericHelper || converters.defaultNumericHelper;
        
        this.settings.converter = converters.currencyMajorMinor;

        // ToDo: Set entry format and value format to different values.
        this.settings.entryFormat = this.settings.valueFormat = numericHelper.settings.decimalSeparator +
            numericHelper.settings.currencyMinorUnitPlaces;

        return this;
    };

    // + float
    prototype.float = function () {
        this.settings.converter = converters.float;

        return this;
    };

    // + integer
    prototype.integer = function () {
        this.settings.converter = converters.integer;

        return this;
    };

    // + number
    prototype.number = function () {
        this.settings.converter = converters.number;

        return this;
    };

    // + string
    prototype.string = function () {
        this.settings.converter = converters.passThrough;

        return this;
    };
})();
