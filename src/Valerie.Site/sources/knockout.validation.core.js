// knockout.validation.core
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="frameworks/knockout-2.2.1.debug.js"/>

(function() {
    "use strict";
    /*global ko */

    if (typeof ko === "undefined") {
        throw {
            "name": "DependencyException",
            "message": "KnockoutJS is required. Please reference it before referencing this library."
        };
    }

    var library = {};

    // ToDo: Support formatted strings, including entry name and value.
    (function() {
        library.localisation = {
            "strings": {
                "valueMissingMessage": "An entry is required.",
                "invalidEntry": "The entry is invalid."
            }
        };
    });

    (function() {
        var failureMessageFunc = function() {
            var state = this._ko_validation.state,
                testResult;

            if (state.valueMissing()) {
                return library.localisation.strings.valueMissingMessage;
            }

            if (state.parseResult().failed) {
                return library.localisation.strings.invalidEntry;
            }

            testResult = state.testResult();

            if (testResult.failed) {
                return testResult.failureMessage;
            }

            return "";
        },
            formattedValueFunc = function() {
                var options = this._ko_validation.options,
                    parseResult,
                    state = this._ko_validation.state,
                    value;

                parseResult = state.parseResult();

                if (parseResult.failed === false) {
                    value = parseResult.value;
                } else {
                    value = this();
                }

                return options.converter.format(value);
            },
            parseResultFunc = function() {
                var options = this._ko_validation.options,
                    result,
                    state = this._ko_validation.state;

                return options.converter.parse(state.enteredValue());
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
                    state = this._ko_validation.state;

                return options.test(state.value());
            },
            textEntryValueReadFunc = function() {
                var state = this._ko_validation.state;

                if (state.valueSource() === library.ValueSource.Code) {
                    return state.formattedValue();
                }

                if (this.validationFailed() === false) {
                    return state.formattedValue();
                }

                return state.enteredValue();
            },
            textEntryValueWriteFunc = function(value) {
                var koValidation = this._ko_validation;

                if (koValidation.options.trimEntryValue) {
                    // ToDo: Trim the entered value.
                }

                koValidation.state.enteredValue(value);
                koValidation.state.valueSource(library.ValueSource.TextEntry);
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
            valueChangedFunc = function(value) {
                var state = this._ko_validation.state;

                state.value(value);
            },
            valueMissingFunc = function() {
                var result,
                    state = this._ko_validation.state;

                result = this.required() && (this.().length === 0);

                return (result);
            };

        ko.validatableObservable = function(value, validationOptions) {
            var observable = (ko.utils.isObservable(value)) ? value : ko.observable(value),
                koValidation = {
                    "state": {
                        "blurred": ko.observable(false),
                        "formattedValue": ko.computed(formattedValueFunc, observable),
                        "enteredValue": ko.observable(""),
                        "parseResult": ko.computed(parseResultFunc, observable),
                        "testResult": ko.computed(testResultFunc, observable),
                        "valueMissing": ko.computed(valueMissingFunc, observable),
                        "valueSource": ko.observable("")
                    },
                    "options": {
                        "context": library.defaultValidationContext,
                        "converter": library.passThroughConverter,
                        "test": library.passThroughTest,
                        "trimEntryValue": true
                    }
                };

            ko.utils.extend(koValidation.options, validationOptions);
            observable._ko_validation = koValidation;

            ko.utils.extend(observable, ko.validatableObservable.fn);
            observable.subscribe(valueChangedFunc, observable);

            // Observables designed for binding.
            observable.applicable = ko.observable(true);
            observable.entryValue = ko.computed({
                "read": textEntryValueReadFunc,
                "write": textEntryValueWriteFunc,
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
                return this;
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
        library.ValidationContext = function(options) {
            this.showSubmissionErrors = ko.observable(false);

            ko.utils.extend(this, options);
        };

        library.defaultValidationContext = new library.ValidationContext();
    })();

    (function() {
        library.ValidationTest = function() {
            this.subscribeToChanges = ko.observable();
        };

        // ReSharper disable UnusedParameter
        library.ValidationTest.prototype.run = function(value) {
            return {
                "failureMessage": "",
                "failed": false
            };
        };
        // ReSharper restore UnusedParameter

        library.passThroughTest = new library.ValidationTest();
    });

    (function() {
        library.ValueSource = {
            "Code": true,
            "Entry": true,
            "TextEntry": true
        };
    })();

    //ko.validation = library;
})();