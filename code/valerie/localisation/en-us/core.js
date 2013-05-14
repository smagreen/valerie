(function () {
    "use strict";
    
    var defaultOptions;

    valerie.ModelValidationState.defaultOptions.failureMessageFormat = "There are validation errors.";

    defaultOptions = valerie.PropertyValidationState.defaultOptions;
    defaultOptions.invalidEntryFailureMessage = "The value entered is invalid.";
    defaultOptions.missingFailureMessage = "A value is required.";
})();
