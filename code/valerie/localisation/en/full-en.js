(function () {
    "use strict";

    var rules = valerie.rules,
        defaultOptions;

    defaultOptions = rules.ArrayLength.defaultOptions;
    defaultOptions.failureMessageFormat = "There must be between {minimum} and {maximum} items.";
    defaultOptions.failureMessageFormatForMinimumOnly = "There must be at least {minimum} items.";
    defaultOptions.failureMessageFormatForMaximumOnly = "There must be at most {maximum} items.";

    defaultOptions = rules.During.defaultOptions;
    defaultOptions.failureMessageFormat = "The value must be between {minimum} and {maximum}.";
    defaultOptions.failureMessageFormatForMinimumOnly = "The value must be {minimum} at the earliest.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The value must be {maximum} at the latest.";

    defaultOptions = rules.Expression.defaultOptions;
    defaultOptions.failureMessageFormat = "The value is invalid.";

    defaultOptions = rules.Length.defaultOptions;
    defaultOptions.failureMessageFormat = "The length must be between {minimum} and {maximum}.";
    defaultOptions.failureMessageFormatForMinimumOnly = "The length must be no less than {minimum}.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The length must be no greater than {maximum}.";

    defaultOptions = rules.Matches.defaultOptions;
    defaultOptions.failureMessageFormat = "The value does not match.";

    defaultOptions = rules.NoneOf.defaultOptions;
    defaultOptions.failureMessageFormat = "The value is not allowed.";

    defaultOptions = rules.Not.defaultOptions;
    defaultOptions.failureMessageFormat = "The value is not allowed.";

    defaultOptions = rules.OneOf.defaultOptions;
    defaultOptions.failureMessageFormat = "The value does not match.";

    defaultOptions = rules.Range.defaultOptions;
    defaultOptions.failureMessageFormat = "The value must be between {minimum} and {maximum}.";
    defaultOptions.failureMessageFormatForMinimumOnly = "The value must be no less than {minimum}.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The value must be no greater than {maximum}.";

    defaultOptions = rules.StringLength.defaultOptions;
    defaultOptions.failureMessageFormat = "The value must have between {minimum} and {maximum} characters.";
    defaultOptions.failureMessageFormatForMinimumOnly = "The value must have at least {minimum} characters.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The value have at most {maximum} characters.";
})();
