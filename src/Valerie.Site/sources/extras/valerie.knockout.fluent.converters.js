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
    prototype.currencyMajor = function() {
        var numericHelper = converters.currency.numericHelper || converters.defaultNumericHelper,
            helperSettings = numericHelper.settings,
            settings = this.settings;

        settings.converter = converters.currencyMajor;
        settings.entryFormat = "";
        settings.valueFormat = helperSettings.currencySign + helperSettings.thousandsSeparator;

        return this;
    };

    // + currencyMajorMinor
    prototype.currencyMajorMinor = function () {
        var numericHelper = converters.currency.numericHelper || converters.defaultNumericHelper,
            helperSettings = numericHelper.settings,
            settings = this.settings;
        
        settings.converter = converters.currencyMajorMinor;
        settings.entryFormat = "";
        settings.valueFormat = helperSettings.currencySign + helperSettings.thousandsSeparator +
            helperSettings.decimalSeparator;

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
