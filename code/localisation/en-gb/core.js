/// <reference path="../../core/valerie.knockout.js"/>

/*global valerie: false */

(function () {
    "use strict";
    
    var knockout = valerie.knockout,
        defaultOptions;

    knockout.ModelValidationState.defaultOptions.failureMessageFormat = "There are validation errors.";

    defaultOptions = knockout.PropertyValidationState.defaultOptions;
    defaultOptions.invalidEntryFailureMessage = "The value entered is invalid.";
    defaultOptions.missingFailureMessage = "A value is required.";
})();
