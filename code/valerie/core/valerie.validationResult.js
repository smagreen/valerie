(function () {
    "use strict";

    var states;

    /**
     * The result of a validation activity.
     * @constructor
     * @param {object} state the result state
     * @param {string} [message] a message from the activity
     * @property {object} state the result state
     * @property {boolean} failed - true if the activity failed validation
     * @property {boolean} passed - true if the activity passed validation
     * @property {boolean} pending - true if the activity hasn't yet completed
     * @property {string} message - a message from the activity
     */
    valerie.ValidationResult = function (state, message) {
        if(message == null) {
            message = "";
        }

        this.state = state;
        this.message = message;

        this.failed = state === states.failed;
        this.passed = state === states.passed;
        this.pending = state === states.pending;
    };

    /**
     * The possible states of a ValidationResult.
     * @name ValidationResult.states
     * @static
     */
    states = valerie.ValidationResult.states = {
        "failed": {},
        "passed": {},
        "pending": {}
    };

    /**
     * The result of an activity that failed validation.
     * @constructor
     * @param {string} [message] a message from the activity
     * @return {valerie.ValidationResult}
     */
    valerie.FailedValidationResult = function (message) {
        return new valerie.ValidationResult(states.failed, message);
    };


    /**
     * The result of an activity that passed validation.
     * @constructor
     * @param {string} [message] a message from the activity
     * @return {valerie.ValidationResult}
     */
    valerie.PassedValidationResult = function (message) {
        return new valerie.ValidationResult(states.passed, message);
    };

    /**
     * An instance of a PassedValidationResult.
     * @memberof valerie.PassedValidationResult
     * @static
     */
    valerie.PassedValidationResult.instance = new valerie.PassedValidationResult();

    /**
     * The result of an activity which hasn't yet completed.
     * @constructor
     * @param {string} [message] a message from the activity
     * @return {valerie.ValidationResult}
     */
    valerie.PendingValidationResult = function (message) {
        return new valerie.ValidationResult(states.pending, message);
    };

    /**
     * An instance of a PendingValidationResult.
     * @memberof valerie.PendingValidationResult
     * @static
     */
    valerie.PendingValidationResult.instance = new valerie.PendingValidationResult();
})();
