// knockout.forms.core
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

    var forms = {};


    // Define 'ValidationContext'.
    (function () {
        forms.ValidationContext = function (options) {
            this.showSubmissionErrors = ko.observable(false);

            ko.utils.extend(this, options);
        };

        forms.defaultValidationContext = new forms.ValidationContext();
    })();


    // Define 'ValidationRule'.
    (function () {
        forms.ValidationRule = function(options) {
        };

        forms.ValidationRule.prototype = ko.observable();
    })();
    

    // Define 'Entry'.
    (function () {
        var entryValueSubscriber = function (entryValue) {
            var value;

            if (entryValue === this.entryValue()) {
                return;
            }

            value = this.parser(entryValue);

            if (value === undefined) {
                this.isValid(false);
                return;
            }

            ko.utils.arrayForEach(this.validationRules, function (validationRule) {
                if (!validationRule(value)) {

                }
            });
        },
            underlyingValueSubscriber = function (value) {
                if (value === this.value()) {
                    return;
                }
            };

        forms.Entry = function (options) {
            var isValidComputed = function() {
                var isValid = true,
                    index;

                if (this.value === undefined) {
                    return false;
                }

                for (index = 0; index < this.validationRules.length; index++) {
                    if(!validationRules[])
                }
            };


            this.applicable = ko.observable(true);
            this.entryValue = ko.observable();
            this.validators = [];
            this.validationContext = forms.defaultValidationContext;
            this.value = ko.observable();

            this.isValid = ko.computed(
            }, this);
        };

        forms.Entry.prototype.formatter = function (underlyingValue) {
            if (typeof underlyingValue === "undefined") {
                return "";
            }

            return underlyingValue.toString();
        };

        forms.Entry.protoype.parser = function (entryValue) {
            return entryValue;
        };

        forms.Entry.prototype.showValidationError = function () {

        };
    })();

    ko.forms = forms;
})();