(function () {
    "use strict";

    /**
     * Creates and sets a property validation state on a Knockout observable.<br/>
     * <i>[fluent]</i>
     * @name ko.observable#validate
     * @method
     * @fluent
     * @param {valerie.PropertyValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the observable
     */
    ko.observable.fn.validate = function(validationOptions) {
        return valerie.validatableProperty(this, validationOptions);
    };

    /**
     * Creates and sets a model validation state on a Knockout observable array.<br/>
     * <i>[fluent]</i>
     * @name ko.observableArray#validateAsModel
     * @method
     * @fluent
     * @param {valerie.ModelValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.ModelValidationState} the validation state belonging to the observable array
     */
    ko.observableArray.fn.validateAsModel = function(validationOptions) {
        return valerie.validatableModel(this, validationOptions);
    };

    /**
     * Creates and returns a property validation state on a Knockout observable array.<br/>
     * <i>[fluent]</i>
     * @name ko.observableArray#propertyValidationState
     * @method
     * @fluent
     * @param {valerie.PropertyValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state created for the observable array
     */
    ko.observableArray.fn.propertyValidationState = function(validationOptions) {
        return new valerie.PropertyValidationState(this, validationOptions);
    };
})();
