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

    (function () {
        forms.localisation = {
            "strings": {
                "missingMessage": "An entry is required.",
                "invalidEntry": "The entry is invalid."
            }
        };
    });

    (function () {
        var validationFailureMessageFunc = function () {
            var testResult,
                validation = this._ko_forms_validation;

            // ToDo: Support formatted strings, including entry name and value.

            if (validation.missing()) {
                return forms.localisation.strings.missingMessage;
            }

            if (validation.parseFailed()) {
                return forms.localisation.strings.invalidEntry;
            }

            testResult = validation.testResult();

            if (testResult.failed) {
                return testResult.failureMessage;
            }

            return "";
        },
            invalidComputation = function () {
                var validation = this._ko_forms_validation;

                if (validation.missing()) {
                    return false;
                }

                if (validation.parseFailed()) {
                    return false;
                }

                return !validation.testResult().failed;
            },
            entryValueReadFunc = function () {
                var validation = this._ko_forms_validation;

                if (this.validationFailed === false) {
                    return validation.formattedValue();
                }

                return validation.enteredValue;
            },
            entryValueWriteFunc = function (value) {
                var validation = this._ko_forms_validation;

                if (validation.trimEntryValue) {
                    // ToDo: Trim the entered value.
                }

                validation.enteredValue(value);
            },
            formattedValueFunc = function () {
                var formattedValue = "",
                    parsedValue,
                    validation = this._ko_forms_validation;

                if (validation.parseResult().failed === false) {
                    parsedValue = validation.parseResult().value;
                    formattedValue = validation.converter.format(parsedValue);
                }

                validation.formattedValue(formattedValue);
            },
            missingFunc = function () {
                var missing,
                    validation = this._ko_forms_validation;

                missing = this.required() && (validation.enteredValue().length === 0);
                validation.missing(missing);
            },
            parseResultFunc = function () {
                var result,
                    validation = this._ko_forms_validation;

                result = validation.converter.parse(validation.enteredValue());

                validation.parseResult(result);
            },
            testResultFunc = function () {
                var result,
                    validation = this._ko_forms_validation;

                validation.test.subscribeToChanges();
                result = validation.test.run(value);

                validation.testResult(result);
            },
            valueChangedFunc = function (value) {
                var validation = this._ko_forms_validation;

                validation.value(value);
            };

        ko.validatableObservable = function (value, validationOptions) {
            var observable = (ko.utils.isObservable(value)) ? value : ko.observable(value),
                validation = {
                    // Internal state.
                    "blurred": ko.observable(false),
                    "formattedValue": ko.observable(""),
                    "enteredValue": ko.observable(),
                    "missing": ko.observable(false),
                    "parseResult": ko.observable({ "failed": undefined, "value": undefined }),
                    "testResult": ko.observable({ "failed": undefined, "failureMessage": "" }),
                    "value": ko.observable(),

                    // Options.
                    "context": forms.defaultValidationContext,
                    "converter": forms.passThroughConverter,
                    "test": forms.passThroughTest,
                    "trimEntryValue": true
                };

            ko.utils.extend(validation, validationOptions);
            observable._ko_forms_validation = validation;

            // Compute internal state. These act as cached one-way dependencies.
            // ToDo: Determine whether to keep references for disposal later.
            validation._formattedValue = ko.computed(formattedValueFunc, observable);
            validation._missing = ko.computed(missingFunc, observable);
            validation._parseResult = ko.computed(parseResultFunc, observable);
            validation._testResult = ko.computed(testResultFunc, observable);

            ko.utils.extend(observable, ko.validatableObservable.fn);
            observable.subscribe(valueChangedFunc, observable);

            // Observables designed for binding.
            observable.applicable = ko.observable(true);
            observable.entryValue = ko.computed({
                "read": entryValueReadFunc,
                "write": entryValueWriteFunc,
                "owner": observable
            });
            observable.required = ko.observable(false);
            observable.showValidationFailure = ko.computed(showFailureMessageFunc, observable);
            observable.validationFailed = ko.computed(validationFailedFunc, observable);
            observable.validationFailureMessage = ko.computed(validationFailureMessageFunc, observable);

            return observable;
        };

        ko.validatableObservable.fn = {
            "inapplicable": function () {
                this._ko_forms_validation.applicable(false);
            },
            "noTrim": function () {
                this._ko_forms_validation.trimEntryValue = false;
                return this;
            },
            "required": function () {
                this._ko_forms_validation.entryRequired = true;
                return this;
            }
        };
    });

    (function () {
        forms.ValidationContext = function (options) {
            this.showSubmissionErrors = ko.observable(false);

            ko.utils.extend(this, options);
        };

        forms.defaultValidationContext = new forms.ValidationContext();
    })();

    (function () {
        forms.ValidationTest = function () {
            this.subscribeToChanges = ko.observable();
        };

        // ReSharper disable UnusedParameter
        forms.ValidationTest.prototype.run = function (value) {

            return {
                "failureMessage": "",
                "passed": true
            };
        };
        // ReSharper restore UnusedParameter

        forms.passThroughTest = new forms.ValidationText();
    });

    ko.forms = forms;
})();