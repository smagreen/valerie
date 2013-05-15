(function () {
    "use strict";

    /**
     * Creates and sets a validation state on a Knockout computed.<br/>
     * <i>[fluent]</i>
     * @name ko.computed#validate
     * @method
     * @fluent
     * @param {valerie.PropertyValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the computed
     */
    ko.computed.fn.validate = function(validationOptions) {
        return valerie.validatableProperty(this, validationOptions);
    };
})();
