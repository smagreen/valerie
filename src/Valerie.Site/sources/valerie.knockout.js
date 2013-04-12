// valerie.knockout
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global ko: false, valerie: false */
/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.core.js"/>

(function() {
    "use strict";

    if (typeof ko === "undefined") {
        throw {
            "name": "DependencyException",
            "message": "KnockoutJS is required. Please reference it before referencing this library."
        };
    }

    var converters = valerie.converters,
        rules = valerie.rules,
        utils = valerie.utils,
        knockout = valerie.knockout = {};

    (function() {
        knockout.ValidationContext = function(options) {
            this.submissionAttempted = ko.observable(false);

            ko.utils.extend(this, options);
        };

        knockout.ValidationContext.default = new knockout.ValidationContext();
    })();

    (function() {
        var
            validate = ko.observable.fn.validate = ko.computed.fn.validate = function(options) {
            var validation;

            options = utils.mergeOptions(validate.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.required = utils.asFunction(options.required);

            validation = this.validation = {
                "entryValue": ko.observable(),
                "options": options
            };
        };

        validate.defaultOptions = {
            "applicable": utils.asFunction(true),
            "context": knockout.ValidationContext.default,
            "converter": converters.passThrough,
            "missingTest": utils.isMissing,            
            "required": utils.asFunction(false),
            "rule": rules.passThrough
        };

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

                result = this.required() && (this.().length === 0)
                ;

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