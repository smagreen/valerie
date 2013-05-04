// valerie.knockout.fluent.rules
// - additional functions for the PropertyValidationState prototype for fluently specifying rules
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.validationResult.js"/>
/// <reference path="../core/valerie.knockout.js"/>
/// <reference path="valerie.rules.js"/>

/*global ko: false, valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var ValidationResult = valerie.ValidationResult,
        // ReSharper restore InconsistentNaming        
        prototype = valerie.knockout.PropertyValidationState.prototype,
        rules = valerie.rules;

    // + during
    prototype.during = function (earliestValueOrFunction, latestValueOrFunction, options) {
        return this.addRule(new rules.During(earliestValueOrFunction, latestValueOrFunction, options));
    };

    // + earliest
    prototype.earliest = function (earliestValueOrFunction, options) {
        return this.addRule(new rules.During(earliestValueOrFunction, undefined, options));
    };

    // + expression
    prototype.expression = function (regularExpressionObjectOrString, options) {
        return this.addRule(new rules.Expression(regularExpressionObjectOrString, options));
    };

    // + latest
    prototype.latest = function (latestValueOrFunction, options) {
        return this.addRule(new rules.During(undefined, latestValueOrFunction, options));
    };

    // + length
    prototype.length = function (shortestValueOrFunction, longestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(shortestValueOrFunction, longestValueOrFunction, options));
    };

    // + matches
    prototype.matches = function (permittedValueOrFunction, options) {
        return this.addRule(new rules.Matches(permittedValueOrFunction, options));
    };

    // + maximum
    prototype.maximum = function (maximumValueOrFunction, options) {
        return this.addRule(new rules.Range(undefined, maximumValueOrFunction, options));
    };

    // + maximumNumberOfItems
    prototype.maximumNumberOfItems = function (maximumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(undefined, maximumValueOrFunction, options));
    };

    // + maximumLength
    prototype.maximumLength = function (longestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(undefined, longestValueOrFunction, options));
    };

    // + ruleMessage
    prototype.ruleMessage = function (message) {
        var stateRules = this.settings.rules,
            index = stateRules.length - 1,
            rule;

        if (index >= 0) {
            rule = stateRules[index];
            rule.settings.failureMessageFormat = message;
        }

        return this;
    };

    // + minimum
    prototype.minimum = function (minimumValueOrFunction, options) {
        return this.addRule(new rules.Range(minimumValueOrFunction, undefined, options));
    };

    // + minimumNumerOfItems
    prototype.minimumNumerOfItems = function (minimumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(minimumValueOrFunction, undefined, options));
    };

    // + minimumLength
    prototype.minimumLength = function (shortestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(shortestValueOrFunction, undefined, options));
    };

    // + noneOf
    prototype.noneOf = function (forbiddenValuesOrFunction, options) {
        return this.addRule(new rules.NoneOf(forbiddenValuesOrFunction, options));
    };

    // + not
    prototype.not = function (forbiddenValueOrFunction, options) {
        return this.addRule(new rules.Not(forbiddenValueOrFunction, options));
    };

    // + numberOfItems
    prototype.numberOfItems = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(minimumValueOrFunction, maximumValueOrFunction, options));
    };

    // + oneOf
    prototype.oneOf = function (permittedValuesOrFunction, options) {
        return this.addRule(new rules.OneOf(permittedValuesOrFunction, options));
    };

    // + range
    prototype.range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        return this.addRule(new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options));
    };

    // + rule
    prototype.rule = function (testFunction, failureMessage) {
        return this.addRule({
            "test": function (value) {
                if (testFunction(value)) {
                    return ValidationResult.success;
                }

                return new ValidationResult(true, failureMessage);
            }
        });
    };
})();

