(function () {
    "use strict";

    // Shortcuts.
    var prototype = valerie.PropertyValidationState.prototype,
        rules = valerie.rules;

    /**
     * Validate the property further by checking its value falls between two permitted dates.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#during
     * @method
     * @param {date|function} earliestValueOrFunction a value or function that specifies the earliest permitted date
     * @param {date|function} latestValueOrFunction a value or function that specifies the latest permitted date
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.during = function (earliestValueOrFunction, latestValueOrFunction, options) {
        return this.addRule(new rules.During(earliestValueOrFunction, latestValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value is not before a permitted date.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#earliest
     * @method
     * @param {date|function} earliestValueOrFunction a value or function that specifies the earliest permitted date
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.earliest = function (earliestValueOrFunction, options) {
        return this.addRule(new rules.During(earliestValueOrFunction, null, options));
    };

    /**
     * Validate the property further by checking its value matches a regular expression.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#expression
     * @method
     * @param {string|RegExp} regularExpressionObjectOrString the regular expression
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.expression = function (regularExpressionObjectOrString, options) {
        return this.addRule(new rules.Expression(regularExpressionObjectOrString, options));
    };

    /**
     * Validate the property further by checking its value is not after a permitted date.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#latest
     * @method
     * @param {date|function} latestValueOrFunction a value or function that specifies the latest permitted date
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.latest = function (latestValueOrFunction, options) {
        return this.addRule(new rules.During(null, latestValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its length is within a certain range.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#lengthBetween
     * @method
     * @param {number|function} shortestValueOrFunction a value or function that specifies the shortest permitted length
     * @param {number|function} longestValueOrFunction a value or function that specifies the longest permitted length
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.lengthBetween = function (shortestValueOrFunction, longestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(shortestValueOrFunction, longestValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value matches another.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#matches
     * @method
     * @param {*} permittedValueOrFunction a value or function that specifies the permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.matches = function (permittedValueOrFunction, options) {
        return this.addRule(new rules.Matches(permittedValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value doesn't exceed a maximum.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#maximum
     * @method
     * @param {*|function} maximumValueOrFunction the value or function that specifies the permitted maximum
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.maximum = function (maximumValueOrFunction, options) {
        return this.addRule(new rules.Range(null, maximumValueOrFunction, options));
    };

    /**
     * Validate the property further by checking the number of items it has doesn't exceed a maximum.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#maximumNumberOfItems
     * @method
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum number of items
     * permitted
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.maximumNumberOfItems = function (maximumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(null, maximumValueOrFunction, options));
    };

    /**
     * Validate the property further by checking it isn't too long.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#maximumLength
     * @method
     * @param {number|function} longestValueOrFunction a value or function that specifies the maximum length permitted
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.maximumLength = function (longestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(null, longestValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value doesn't exceed a minimum.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#minimum
     * @method
     * @param {*|function} minimumValueOrFunction the value or function that specifies the permitted minimum
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.minimum = function (minimumValueOrFunction, options) {
        return this.addRule(new rules.Range(minimumValueOrFunction, null, options));
    };

    /**
     * Validate the property further by checking the number of items it has doesn't exceed a minimum.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#minimumNumberOfItems
     * @method
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum number of items
     * permitted
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.minimumNumberOfItems = function (minimumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(minimumValueOrFunction, null, options));
    };

    /**
     * Validate the property further by checking it isn't too short.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#minimumLength
     * @method
     * @param {number|function} shortestValueOrFunction a value or function that specifies the minimum length permitted
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.minimumLength = function (shortestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(shortestValueOrFunction, null, options));
    };

    /**
     * Validate the property further by checking its value is not in a list of forbidden values.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#noneOf
     * @method
     * @param {array|function} forbiddenValuesOrFunction a value or function that specifies the forbidden values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.noneOf = function (forbiddenValuesOrFunction, options) {
        return this.addRule(new rules.NoneOf(forbiddenValuesOrFunction, options));
    };

    /**
     * Validate the property further by checking its value does not match another.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#not
     * @method
     * @param {*} forbiddenValueOrFunction a value or function that specifies the forbidden values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.not = function (forbiddenValueOrFunction, options) {
        return this.addRule(new rules.Not(forbiddenValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its number of items hasn't exceed a minimum or maximum number.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#numberOfItems
     * @method
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum number of items
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum number of items
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.numberOfItems = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(minimumValueOrFunction, maximumValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value is in a list of permitted values.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#oneOf
     * @method
     * @param {array|function} permittedValuesOrFunction a value or function that specifies the permitted values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.oneOf = function (permittedValuesOrFunction, options) {
        return this.addRule(new rules.OneOf(permittedValuesOrFunction, options));
    };

    /**
     * Validate the property further by checking its value doesn't exceed a minimum or maximum value.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#range
     * @method
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted value
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        return this.addRule(new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options));
    };

    /**
     * Validate the property further by add an ad-hoc rule to the rule-chain.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#rule
     * @method
     * @param {function} testFunction the function to use to test the property's value
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.rule = function (testFunction) {
        return this.addRule({
            "settings": {
            },
            "test": function (value) {
                return testFunction(value);
            }
        });
    };

    /**
     * Sets the message to show if the rule last added to the validation state's rule-chain fails.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#ruleMessage
     * @method
     * @param {string} failureMessageFormat the format for the validation message
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.ruleMessage = function (failureMessageFormat) {
        var stateRules = this.settings.rules,
            index = stateRules.length - 1,
            rule;

        if (index >= 0) {
            rule = stateRules[index];
            rule.settings.failureMessageFormat = failureMessageFormat;
        }

        return this;
    };
})();
