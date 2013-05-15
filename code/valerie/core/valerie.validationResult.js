(function () {
    "use strict";

    var states = {
        "failed": {},
        "passed": {},
        "pending": {}
    };

    /**
     * Constructs the result of a validation activity.
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
        if (message == null) {
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
    valerie.ValidationResult.states = states;

    /**
     * A validation result for when validation has passed.
     * @type {valerie.ValidationResult}
     */
    valerie.ValidationResult.passedInstance = new valerie.ValidationResult(states.passed);

    /**
     * A validation result for when validation hasn't yet completed.
     * @type {valerie.ValidationResult}
     */
    valerie.ValidationResult.pendingInstance = new valerie.ValidationResult(states.pending);

    /**
     * Creates a validation result for when validation has failed.
     * @param {string} [message] a message from the activity
     * @return {valerie.ValidationResult}
     */
    valerie.ValidationResult.createFailedResult = function (message) {
        return new valerie.ValidationResult(states.failed, message);
    };
})();
