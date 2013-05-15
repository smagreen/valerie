(function () {
    "use strict";

    /**
     * Validate the property using <b>valerie.converters.postcode</b>.<br/>
     * <i>[fluent, full, en-gb]</i>
     * @name valerie.PropertyValidationState#postcode
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    valerie.PropertyValidationState.prototype.postcode = function () {
        this.settings.converter = valerie.converters.postcode;

        return this;
    };
})();
