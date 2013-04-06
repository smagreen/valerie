// knockout.forms
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="frameworks/knockout-2.2.1.debug.js"/>

(function () {
    "use strict";

    if (typeof ko === "undefined") {
        throw {
            "name": "DependencyException",
            "message": "KnockoutJS is required. Please reference it before referencing this library."
        };
    }

    ko.forms = {};

    ko.forms.ValidationContext = function () {
        this.showSubmissionErrors = ko.observable(false);
    };

    ko.forms.defaultValidationContext = new ko.forms.ValidationContext();

    ko.forms.createEntry = function (options) {
        options = options || {};

        var validationContext = options.ValidationContext || ko.forms.defaultValidationContext;
        return {

        };
    };
})();