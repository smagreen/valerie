(function() {
    "use strict";

    /**
     * Contains rule classes for validating models and properties.
     * @namespace
     * @see valerie.IRule
     */
    valerie.rules = {};

    // Shortcuts.
    var utils = valerie.utils,
        formatting = valerie.formatting,
        rules = valerie.rules,
        passedValidationResult = valerie.ValidationResult.passedInstance;

    /**
     * Constructs a rule to test whether an array's length is within a permitted range.<br/>
     * <i>[full]</i>
     * @name valerie.rules.ArrayLength
     * @type valerie.IRule
     * @constructor
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted length
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted length
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.ArrayLength = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.ArrayLength.defaultOptions, options);

        //noinspection JSValidateTypes
        return new rules.Length(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.ArrayLength.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.ArrayLength.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    /**
     * Constructs a rule to test whether a date value is within a permitted time-span.<br/>
     * <i>[full]</i>
     * @name valerie.rules.During
     * @type valerie.IRule
     * @constructor
     * @param {date|function} minimumValueOrFunction a value or function that specifies the earliest permitted date
     * @param {date|function} maximumValueOrFunction a value or function that specifies the latest permitted date
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.During = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.During.defaultOptions, options);

        //noinspection JSValidateTypes
        return new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.During.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.During.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    /**
     * Constructs a rule to test whether a string value matches the given regular expression.<br/>
     * <i>[full]</i>
     * @name valerie.rules.Expression
     * @type valerie.IRule
     * @constructor
     * @param {string|RegExp} regularExpressionObjectOrString the regular expression
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Expression = function(regularExpressionObjectOrString, options) {
        this.expression = utils.isString(regularExpressionObjectOrString) ?
            new RegExp(regularExpressionObjectOrString) :
            regularExpressionObjectOrString;

        this.settings = utils.mergeOptions(rules.Expression.defaultOptions, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Expression.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Expression.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    rules.Expression.prototype = {
        "test": function(value) {
            var failureMessage;

            if (value != null) {
                if (this.expression.test(value)) {
                    return passedValidationResult;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                this.settings.failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return valerie.ValidationResult.createFailedResult(failureMessage);
        }
    };

    /**
     * Constructs a rule to test whether an object's <code>length</code> property is within a permitted range.<br/>
     * <i>[full]</i>
     * @name valerie.rules.Length
     * @type valerie.IRule
     * @constructor
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted value
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
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

            return rangeRule.test(length);
        };

        this.settings = rangeRule.settings;
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Length.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Length.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    /**
     * Constructs a rule to test whether a value matches another.<br/>
     * <i>[full]</i>
     * @name valerie.rules.Matches
     * @type valerie.IRule
     * @constructor
     * @param {*} permittedValueOrFunction a value or function that specifies the permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Matches = function(permittedValueOrFunction, options) {
        options = utils.mergeOptions(rules.Matches.defaultOptions, options);

        return new rules.OneOf([permittedValueOrFunction], options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Matches.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Matches.defaultOptions = {
        "failureMessageFormat": "",
        "formatter": valerie.converters.passThrough.format,
        "valueFormat": null
    };

    //noinspection FunctionWithInconsistentReturnsJS
    /**
     * Constructs a rule to test whether a value is not in a list of forbidden values.<br/>
     * <i>[full]</i>
     * @name valerie.rules.NoneOf
     * @type valerie.IRule
     * @constructor
     * @param {array} forbiddenValuesOrFunction a value or function that specifies the forbidden values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.NoneOf = function(forbiddenValuesOrFunction, options) {
        this.forbiddenValues = utils.asFunction(forbiddenValuesOrFunction);
        this.settings = utils.mergeOptions(rules.NoneOf.defaultOptions, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.NoneOf.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.NoneOf.defaultOptions = {
        "failureMessageFormat": "",
        "formatter": valerie.converters.passThrough.format,
        "valueFormat": null
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

                    return valerie.ValidationResult.createFailedResult(failureMessage);
                }
            }

            return passedValidationResult;
        }
    };

    /**
     * Constructs a rule to test whether a value does not match another.<br>
     * <i>[full]</i>
     * @name valerie.rules.Not
     * @type valerie.IRule
     * @constructor
     * @param {*} forbiddenValueOrFunction a value or function that specifies the forbidden value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Not = function(forbiddenValueOrFunction, options) {
        options = utils.mergeOptions(rules.Not.defaultOptions, options);

        return new rules.NoneOf([forbiddenValueOrFunction], options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Not.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Not.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    /**
     * Constructs a rule to test whether a value is in a list of permitted values.<br/>
     * <i>[full]</i>
     * @name valerie.rules.OneOf
     * @type valerie.IRule
     * @constructor
     * @param {array} permittedValuesOrFunction a value or function that specifies the permitted values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.OneOf = function(permittedValuesOrFunction, options) {
        this.permittedValues = utils.asFunction(permittedValuesOrFunction);
        this.settings = utils.mergeOptions(rules.OneOf.defaultOptions, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.OneOf.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.OneOf.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
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

            return valerie.ValidationResult.createFailedResult(failureMessage);
        }
    };

    /**
     * Constructs a rule to test whether an value is within a permitted range.<br/>
     * <i>[full]</i>
     * @name valerie.rules.Range
     * @type valerie.IRule
     * @constructor
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted value
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Range = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "At least 2 arguments are expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.settings = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Range.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Range.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
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

            return valerie.ValidationResult.createFailedResult(failureMessage);
        }
    };

    /**
     * Constructs a rule to test whether a string's length is within a permitted range.<br/>
     * <i>[full]</i>
     * @name valerie.rules.StringLength
     * @type valerie.IRule
     * @constructor
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted length
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted length
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.StringLength = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.StringLength.defaultOptions, options);

        //noinspection JSValidateTypes
        return new rules.Length(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.StringLength.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.StringLength.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };
})();
