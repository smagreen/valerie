// valerie.knockout.fluent
// - additional functions for the PropertyValidationState prototype for fluently specifying converters and rules
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

    // + during
    prototype.during = function (earliestValueOrFunction, latestValueOrFunction, options) {
        this.settings.rule = new rules.During(earliestValueOrFunction, latestValueOrFunction, options);

        return this;
    };

    // + earliest
    prototype.earliest = function (earliestValueOrFunction, options) {
        this.settings.rule = new rules.During(earliestValueOrFunction, undefined, options);

        return this;
    };

    // + latest
    prototype.latest = function (latestValueOrFunction, options) {
        this.settings.rule = new rules.During(undefined, latestValueOrFunction, options);

        return this;
    };

    // + length
    prototype.length = function (shortestValueOrFunction, longestValueOrFunction, options) {
        this.settings.rule = new rules.StringLength(shortestValueOrFunction, longestValueOrFunction, options);

        return this;
    };

    // + matches
    prototype.matches = function (permittedValueOrFunction, options) {
        permittedValueOrFunction = [permittedValueOrFunction];

        this.settings.rule = new rules.Matches(permittedValueOrFunction, options);

        return this;
    };

    // + maximum
    prototype.maximum = function (maximumValueOrFunction, options) {
        this.settings.rule = new rules.Range(undefined, maximumValueOrFunction, options);

        return this;
    };

    // + maximumNumerOfItems
    prototype.maximumNumerOfItems = function (maximumValueOrFunction, options) {
        this.settings.rule = new rules.ArrayLength(undefined, maximumValueOrFunction, options);

        return this;
    };

    // + maximumLength
    prototype.maximumLength = function (longestValueOrFunction, options) {
        this.settings.rule = new rules.StringLength(undefined, longestValueOrFunction, options);

        return this;
    };

    // + message
    prototype.message = function (message) {
        this.settings.rule.settings.failureMessageFormat = message;

        return this;
    };
    
    // + minimum
    prototype.minimum = function (minimumValueOrFunction, options) {
        this.settings.rule = new rules.Range(minimumValueOrFunction, undefined, options);

        return this;
    };

    // + minimumNumerOfItems
    prototype.minimumNumerOfItems = function (minimumValueOrFunction, options) {
        this.settings.rule = new rules.ArrayLength(minimumValueOrFunction, undefined, options);

        return this;
    };

    // + minimumLength
    prototype.maximumLength = function (shortestValueOrFunction, options) {
        this.settings.rule = new rules.StringLength(shortestValueOrFunction, undefined, options);

        return this;
    };

    // + noneOf
    prototype.noneOf = function (forbiddenValuesOrFunction, options) {
        this.settings.rule = new rules.NoneOf(forbiddenValuesOrFunction, options);

        return this;
    };

    // + not
    prototype.not = function (forbiddenValueOrFunction, options) {
        this.settings.rule = new rules.Not([forbiddenValueOrFunction], options);

        return this;
    };

    // + number
    prototype.number = function () {
        this.settings.converter = converters.number;

        return this;
    };

    // + numberOfItems
    prototype.numberOfItems = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        this.settings.rule = new rules.ArrayLength(minimumValueOrFunction, maximumValueOrFunction, options);

        return this;
    };

    // + oneOf
    prototype.oneOf = function (permittedValuesOrFunction, options) {
        this.settings.rule = new rules.OneOf(permittedValuesOrFunction, options);

        return this;
    };

    // + range
    prototype.range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        this.settings.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);

        return this;
    };

    // + rule
    prototype.rule = function (testFunction, failureMessage) {
        this.settings.rule = {
            "test": function (value) {
                if (testFunction(value)) {
                    return ValidationResult.success;
                }

                return new ValidationResult(true, failureMessage);
            }
        };

        return this;
    };

    // + string
    prototype.string = function () {
        this.settings.converter = converters.string;

        return this;
    };
})();
