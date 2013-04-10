// knockout.validation.core
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="frameworks/knockout-2.2.1.debug.js"/>

(function() {
    "use strict";

    if (typeof ko === "undefined") {
        throw {
            "name": "DependencyException",
            "message": "KnockoutJS is required. Please reference it before referencing this library."
        };
    }

    var validation = {};

    (function() {
        validation.localisation = {
            "strings": {
                "valueMissingMessage": "An entry is required.",
                "invalidEntry": "The entry is invalid."
            }
        };
    });

    (function() {
        var entryValueReadFunc = function() {
            var state = this._ko_validation.state;

            if (this.validationFailed === false) {
                return state.formattedValue();
            }

            return state.enteredValue();
        },
            entryValueWriteFunc = function(value) {
                var validation = this._ko_validation;

                if (validation.options.trimEntryValue) {
                    // ToDo: Trim the entered value.
                }

                return validation.state.enteredValue(value);
            },
            failureMessageFunc = function() {
                var state = this._ko_validation.state,
                    testResult;

                // ToDo: Support formatted strings, including entry name and value.

                if (state.valueMissing()) {
                    return validation.localisation.strings.valueMissingMessage;
                }

                if (state.parseResult().failed) {
                    return validation.localisation.strings.invalidEntry;
                }

                testResult = state.testResult();

                if (testResult.failed) {
                    return testResult.failureMessage;
                }

                return "";
            },
            formattedValueFunc = function() {
                var parseResult,
                    parsedValue,
                    state = this._ko_validation.state;

                parseResult = state.parseResult();

                if (parseResult.failed === false) {
                    parsedValue = parseResult.value;
                    return options.converter.format(parsedValue);
                }

                return "";
            },
            validationFailedFunc = function() {
                var state = this._ko_validation.state;

                if (state.missing()) {
                    return true;
                }

                if (state.parseFailed()) {
                    return true;
                }

                if (state.testResult().failed) {
                    return true;
                }

                return false;
            },
            valueMissingFunc = function() {
                var missing,
                    validation = this._ko_validation;

                missing = this.required() && (validation.enteredValue().length === 0);

                return (missing);
            },
            parseResultFunc = function() {
                var options = this._ko_validation.options,
                    result,
                    state = this._ko_validation.state;

                result = options.converter.parse(state.enteredValue());
                state.parseResult(result);
            },
            showFailureMessageFunc = function() {
                var options = this._ko_validation.options,
                    state = this._ko_validation.state;

                if (!state.validationFailed()) {
                    return false;
                }
                
                if (options.context.showSubmissionErrors()) {
                    return true;
                }
                
                if (state.blurred()) {
                    return true;
                }

                return false;
            },
        testResultFunc = function() {
                var options = this._ko_validation.options,
                    result,
                    state = this._ko_validation.state;

                options.test.subscribeToChanges();

                result = options.test.run(value);

                state.testResult(result);
            },
            valueChangedFunc = function(value) {
                var state = this._ko_validation.state;

                state.value(value);
            };

        ko.validatableObservable = function(value, validationOptions) {
            var observable = (ko.utils.isObservable(value)) ? value : ko.observable(value),
                validation = {
                    "state": {
                        "blurred": ko.observable(false),
                        "formattedValue": ko.computed(formattedValueFunc, observable),
                        "enteredValue": ko.observable(),
                        "parseResult": ko.computed(parseResultFunc, observable),
                        "testResult": ko.computed(testResultFunc, observable),
                        "value": ko.observable(),
                        "valueMissing": ko.computed(valueMissingFunc, observable)
                    },
                    "options": {
                        "context": validation.defaultValidationContext,
                        "converter": validation.passThroughConverter,
                        "test": validation.passThroughTest,
                        "trimEntryValue": true
                    }
                };

            ko.utils.extend(validation.options, validationOptions);
            observable._ko_validation = validation;

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
            observable.validationFailureMessage = ko.computed(failureMessageFunc, observable);

            return observable;
        };

        ko.validatableObservable.fn = {
            "inapplicable": function() {
                this._ko_validation.applicable(false);
            },
            "noTrim": function() {
                this._ko_validation.trimEntryValue = false;
                return this;
            },
            "required": function() {
                this._ko_validation.entryRequired = true;
                return this;
            }
        };
    });

    (function() {
        validation.ValidationContext = function(options) {
            this.showSubmissionErrors = ko.observable(false);

            ko.utils.extend(this, options);
        };

        validation.defaultValidationContext = new validation.ValidationContext();
    })();

    (function() {
        validation.ValidationTest = function() {
            this.subscribeToChanges = ko.observable();
        };

        // ReSharper disable UnusedParameter
        validation.ValidationTest.prototype.run = function(value) {
            return {
                "failureMessage": "",
                "failed": false
            };
        };
        // ReSharper restore UnusedParameter

        validation.passThroughTest = new validation.ValidationText();
    });

    ko.validation = validation;
})();