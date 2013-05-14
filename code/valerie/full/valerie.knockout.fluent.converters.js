// valerie.knockout.fluent.converters
// - additional functions for the PropertyValidationState prototype for fluently specifying converters

/// <reference path="../core/valerie.js"/>
/// <reference path="../core/valerie.utils.js"/>
/// <reference path="../core/valerie.knockout.js"/>
/// <reference path="valerie.converters.js"/>

/*jshint eqnull: true */
/*global valerie: false */

(function () {
    "use strict";

    var utils = valerie.utils,
        converters = valerie.converters,
        prototype = valerie.knockout.PropertyValidationState.prototype;

    // + currencyMajor
    prototype.currencyMajor = function (options) {
        options = utils.mergeOptions(this.currencyMajor.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.currencyMajor;

        return this;
    };

    prototype.currencyMajor.defaultOptions = {
        "entryFormat": null,
        "valueFormat": "C,"
    };

    // + currencyMajorMinor
    prototype.currencyMajorMinor = function (options) {
        options = utils.mergeOptions(this.currencyMajorMinor.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.currencyMajorMinor;

        return this;
    };

    prototype.currencyMajorMinor.defaultOptions = {
        "entryFormat": ".c",
        "valueFormat": "C,.c"
    };

    // + date
    prototype.date = function () {
        this.settings.converter = converters.date;

        return this;
    };

    // + email
    prototype.email = function () {
        this.settings.converter = converters.email;

        return this;
    };

    // + float
    prototype.float = function (options) {
        options = utils.mergeOptions(this.float.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.float;

        return this;
    };

    prototype.float.defaultOptions = {
        "entryFormat": null,
        "valueFormat": ",."
    };

    // + integer
    prototype.integer = function (options) {
        options = utils.mergeOptions(this.integer.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.integer;

        return this;
    };

    prototype.integer.defaultOptions = {
        "entryFormat": null,
        "valueFormat": ","
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
