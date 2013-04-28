(function () {
    var knockout = valerie.knockout,
        rules = valerie.rules,
        defaultOptions;

    knockout.ModelValidationState.defaultOptions.failureMessageFormat = "There are validation errors.";

    defaultOptions = knockout.PropertyValidationState.defaultOptions;
    defaultOptions.invalidEntryFailureMessage = "The value entered is invalid";
    defaultOptions.missingFailureMessage = "A value is required";

    defaultOptions = rules.Range.defaultOptions;
    defaultOptions.failureMessageFormatForMinimumOnly = "The value must be no less than {minimum}.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The value must be no greater than {maximum}.";
    defaultOptions.failureMessageFormatForRange = "The value must be between {minimum} and {maximum}.";
})();
