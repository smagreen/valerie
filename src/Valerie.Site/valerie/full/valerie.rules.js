// valerie.rules
// - general purpose rules
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.validationResult.js"/>
/// <reference path="../core/valerie.passThroughConverter.js"/>
/// <reference path="../core/valerie.utils.js"/>

/*jshint eqnull: true */
/*global valerie: false */

(function() {
    "use strict";

    // ReSharper disable InconsistentNaming
    var FailedValidationResult = valerie.FailedValidationResult,
        // ReSharper restore InconsistentNaming        
        passedValidationResult = valerie.ValidationResult.passed,
        rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils,
        formatting = valerie.formatting;

    // + rules.ArrayLength
    rules.ArrayLength = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.ArrayLength.defaultOptions, options);

        return new rules.Length(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    rules.ArrayLength.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.During
    rules.During = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.During.defaultOptions, options);

        return new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    rules.During.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.Expression
    rules.Expression = function(regularExpressionObjectOrString, options) {
        this.expression = utils.isString(regularExpressionObjectOrString) ?
            new RegExp(regularExpressionObjectOrString) :
            regularExpressionObjectOrString;

        this.settings = utils.mergeOptions(rules.Expression.defaultOptions, options);
    };

    rules.Expression.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Expression.prototype = {
        "test": function(value) {
            var failureMessage;

            if (value != null) {
                if (this.expresssion.test(value)) {
                    return passedValidationResult;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                this.settings.failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new FailedValidationResult(failureMessage);
        }
    };

    // + rules.Length
    rules.Length = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.Length.defaultOptions, options);

        var rangeRule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);

        this.test = function(value) {
            var length;

            if (value != null && value.hasOwnProperty("length")) {
                length = value.length;
            }

            // ReSharper disable UsageOfPossiblyUnassignedValue
            return rangeRule.test(length);
            // ReSharper restore UsageOfPossiblyUnassignedValue
        };
    };

    rules.Length.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.Matches
    rules.Matches = function(permittedValueOrFunction, options) {
        options = utils.mergeOptions(rules.Matches.defaultOptions, options);

        return new rules.OneOf([permittedValueOrFunction], options);
    };

    rules.Matches.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.NoneOf
    rules.NoneOf = function(forbiddenValuesOrFunction, options) {
        this.forbiddenValues = utils.asFunction(forbiddenValuesOrFunction);
        this.settings = utils.mergeOptions(rules.NoneOf.defaultOptions, options);
    };

    rules.NoneOf.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.NoneOf.prototype = {
        "test": function(value) {
            var failureMessage,
                index,
                values = this.forbiddenValues();

            for (index = 0; index < values.length; index++) {
                if (value === values[index]) {
                    failureMessage = formatting.replacePlaceholders(
                        this.settings.failureMessageFormat, {
                            "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                        });

                    return new FailedValidationResult(failureMessage);
                }
            }

            return passedValidationResult;
        }
    };

    // + rules.Not
    rules.Not = function(forbiddenValueOrFunction, options) {
        options = utils.mergeOptions(rules.Not.defaultOptions, options);

        return new rules.NoneOf([forbiddenValueOrFunction], options);
    };

    rules.Not.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.OneOf
    rules.OneOf = function(permittedValuesOrFunction, options) {
        this.permittedValues = utils.asFunction(permittedValuesOrFunction);
        this.settings = utils.mergeOptions(rules.OneOf.defaultOptions, options);
    };

    rules.OneOf.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.OneOf.prototype = {
        "test": function(value) {
            var failureMessage,
                index,
                values = this.permittedValues();

            for (index = 0; index < values.length; index++) {
                if (value === values[index]) {
                    return passedValidationResult;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                this.settings.failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new FailedValidationResult(failureMessage);
        }
    };

    // + rules.Range
    rules.Range = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "At least 2 arguments are expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.settings = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function(value) {
            var failureMessage,
                failureMessageFormat = this.settings.failureMessageFormat,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum != null,
                haveMinimum = minimum != null,
                haveValue = value != null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return passedValidationResult;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return passedValidationResult;
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "maximum": this.settings.valueFormatter(maximum, this.settings.valueFormat),
                    "minimum": this.settings.valueFormatter(minimum, this.settings.valueFormat),
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new FailedValidationResult(failureMessage);
        }
    };

    // + rules.StringLength
    rules.StringLength = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.StringLength.defaultOptions, options);

        return new rules.Length(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    rules.StringLength.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.formatter
    };
})();
