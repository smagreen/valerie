// valerie.validationResult
// - defines the ValidationResult constructor function
// - used by other parts of the valerie library

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var states = {
        "failed": {},
        "passed": {},
        "pending": {}
    },
        // ReSharper disable InconsistentNaming
        ValidationResult;
    // ReSharper restore InconsistentNaming

    // + ValidationResult
    // - the result of a validation test
    ValidationResult = valerie.ValidationResult = function (state, message) {
        this.state = state;

        this.failed = state === states.failed;
        this.passed = state === states.passed;
        this.pending = state === states.pending;

        this.message = message;
    };

    valerie.ValidationResult.states = states;

    // + FailedValidationResult
    // - a failed result for a validation test
    valerie.FailedValidationResult = function (message) {
        return new ValidationResult(states.failed, message);
    };

    // + PassedValidationResult
    // - a passed result for a validation test
    valerie.PassedValidationResult = function (message) {
        return new ValidationResult(states.passed, message);
    };

    // + PendingValidationResult
    // - a pending result for a validation test
    valerie.PendingValidationResult = function (message) {
        return new ValidationResult(states.pending, message);
    };

    valerie.ValidationResult.passed = new ValidationResult(states.passed, "");
    
    valerie.ValidationResult.pending = new ValidationResult(states.pending, "");
})();
