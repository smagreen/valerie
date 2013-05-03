// valerie.rules
// - general purpose rules
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.validationResult.js"/>
/// <reference path="../core/valerie.passThrough.js"/>
/// <reference path="../core/valerie.utils.js"/>

/*global valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var ValidationResult = valerie.ValidationResult,
        // ReSharper restore InconsistentNaming
        rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils,
        formatting = valerie.formatting;

    // + rules.ArrayLength
    rules.ArrayLength = function (minimumValueOrFunction, maximumValueOrFunction, options) {
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
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.During
    rules.During = function (minimumValueOrFunction, maximumValueOrFunction, options) {
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
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.Expression
    rules.Expression = function (regularExpression, options) {       
        this.expression = utils.isString(regularExpression) ? new RegExp(regularExpression) : regularExpression;
        this.settings = utils.mergeOptions(rules.Expression.defaultOptions, options);
    };

    rules.Expression.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Expression.prototype = {
        "test": function(value) {
            var failureMessage;

            if (value !== undefined && value !== null) {
                if (this.expresssion.test(value)) {
                    return ValidationResult.success;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new ValidationResult(true, failureMessage);
        }
    };
    
    // + rules.Length
    rules.Length = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.Length.defaultOptions, options);

        var rangeRule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);

        this.test = function (value) {
            var length = undefined;

            if (value !== undefined && value !== null && value.hasOwnProperty("length")) {
                length = value.length;
            }

            return rangeRule.test(length);
        };
    };

    rules.Length.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.Matches
    rules.Matches = function (permittedValueOrFunction, options) {
        options = utils.mergeOptions(rules.Matches.defaultOptions, options);

        return new rules.OneOf([permittedValueOrFunction], options);
    };

    rules.Matches.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.NoneOf
    rules.NoneOf = function (forbiddenValuesOrFunction, options) {
        this.forbiddenValues = utils.asFunction(forbiddenValuesOrFunction);
        this.settings = utils.mergeOptions(rules.NoneOf.defaultOptions, options);
    };

    rules.NoneOf.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.NoneOf.prototype = {
        "test": function (value) {
            var failureMessage,
                index,
                values = forbiddenValues();

            for (index = 0; index < values.length; index++) {
                if (value === values[index]) {
                    failureMessage = formatting.replacePlaceholders(
                        failureMessageFormat, {
                            "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                        });

                    return new ValidationResult(true, failureMessage);
                }
            }

            return ValidationResult.success;
        }
    };

    // + rules.Not
    rules.Not = function (forbiddenValueOrFunction, options) {
        options = utils.mergeOptions(rules.Not.defaultOptions, options);

        return new rules.NoneOf([forbiddenValueOrFunction], options);
    };

    rules.Not.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    // + rules.OneOf
    rules.OneOf = function (permittedValuesOrFunction, options) {
        this.permittedValues = utils.asFunction(permittedValuesOrFunction);
        this.settings = utils.mergeOptions(rules.OneOf.defaultOptions, options);
    };

    rules.OneOf.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.OneOf.prototype = {
        "test": function (value) {
            var failureMessage,
                index,
                values = permittedValues();

            for (index = 0; index < values.length; index++) {
                if (value === values[index]) {
                    return ValidationResult.success;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new ValidationResult(true, failureMessage);
        }
    };

    // + rules.Range
    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
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
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function (value) {
            var failureMessage,
                failureMessageFormat = this.settings.failureMessageFormat,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum !== undefined && maximum !== null,
                haveMinimum = minimum !== undefined && minimum !== null,
                haveValue = value !== undefined && value !== null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return ValidationResult.success;
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
                return ValidationResult.success;
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "maximum": this.settings.valueFormatter(maximum, this.settings.valueFormat),
                    "minimum": this.settings.valueFormatter(minimum, this.settings.valueFormat),
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return new ValidationResult(true, failureMessage);
        }
    };

    // + rules.StringLength
    rules.StringLength = function (minimumValueOrFunction, maximumValueOrFunction, options) {
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
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };
})();
