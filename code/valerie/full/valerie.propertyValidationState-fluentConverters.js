(function () {
    "use strict";

    // Shortcuts.
    var utils = valerie.utils,
        converters = valerie.converters,
        prototype = valerie.PropertyValidationState.prototype;

    /**
     * Validate the property using <b>valerie.converters.currencyMajor</b>.<br/>
     * <b>valerie.PropertyValidationState.prototype.currencyMajor.defaultOptions</b> holds the default options used by
     * this fluent method.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#currencyMajor
     * @method
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to apply to the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state
     */
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

    /**
     * Validate the property using <b>valerie.converters.currencyMajorMinor</b>.<br/>
     * <b>valerie.PropertyValidationState.prototype.currencyMajorMinor.defaultOptions</b> holds the default options used
     * by this fluent method.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#currencyMajorMinor
     * @method
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to apply to the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state
     */
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

    /**
     * Validate the property using <b>valerie.converters.date</b>.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#date
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.date = function () {
        this.settings.converter = converters.date;

        return this;
    };

    /**
     * Validate the property using <b>valerie.converters.email</b>.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#email
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.email = function () {
        this.settings.converter = converters.email;

        return this;
    };

    /**
     * Validate the property using <b>valerie.converters.float</b>.<br/>
     * <b>valerie.PropertyValidationState.prototype.float.defaultOptions</b> holds the default options used by this
     * fluent method.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#float
     * @method
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to apply to the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state
     */
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

    /**
     * Validate the property using <b>valerie.converters.integer</b>.<br/>
     * <b>valerie.PropertyValidationState.prototype.integer.defaultOptions</b> holds the default options used by this
     * fluent method.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#integer
     * @method
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to apply to the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state
     */
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

    /**
     * Validate the property using <b>valerie.converters.number</b>.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#number
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.number = function () {
        this.settings.converter = converters.number;

        return this;
    };

    /**
     * Validate the property using <b>valerie.converters.passThrough</b>.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#string
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.string = function () {
        this.settings.converter = converters.passThrough;

        return this;
    };
})();
