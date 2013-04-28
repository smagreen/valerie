// valerie.validationResult
// - defines the ValidationResult constructor function
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    // + ValidationResult
    // - the result of a validation test
    valerie.ValidationResult = function (failed, failureMessage) {
        this.failed = failed;
        this.failureMessage = failureMessage;
    };

    valerie.ValidationResult.success = new valerie.ValidationResult(false, "");
})();
