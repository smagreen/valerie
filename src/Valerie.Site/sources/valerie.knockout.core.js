// valerie.knockout.core
// - the core namespaces and objects for using valerie with knockoutjs
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global ko: false, valerie: false */
/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.core.js"/>

(function () {
    var statePropertyName = "__valerie_knockout_state";

    if (typeof ko === "undefined") {
        throw {
            "name": "DependencyException",
            "message": "KnockoutJS is required. Please reference it before referencing this library."
        };
    }

    // Define functions for getting, setting and testing the existence of the underlying validation state.
    valerie.knockout = {
        "getState": function (observableOrComputed) {
            return observableOrComputed[statePropertyName];
        },
        "setState": function (observableOrComputed, state) {
            observableOrComputed[statePropertyName] = state;
        }
    };
})();

(function () {
    "use strict";

    var converters = valerie.converters,
        knockout = valerie.knockout,
        rules = valerie.rules,
        utils = valerie.utils;

    (function () {
        // ValidationContext
        // - aggregates validatable observables or computeds
        // - records whether an attempt has been made to submit them
        // - ToDo: can be used to determine if any them are invalid
        knockout.ValidationContext = function (options) {
            this.submissionAttempted = ko.observable(false);

            ko.utils.extend(this, options);
        };

        knockout.ValidationContext.defaultContext = new knockout.ValidationContext();

        // ValidationResult
        // - the result of a validation test
        knockout.ValidationResult = function (failed, failureMessage) {
            this.failed = failed;
            this.failureMessage = failureMessage;
        };

        knockout.ValidationResult.success = new knockout.ValidationResult(false, "");

        // ValidationState
        (function () {
            var missingResultFunction = function () {
                var value = this.observableOrComputed();

                if (!this.options.required() || !this.options.missingTest(value)) {
                    return knockout.ValidationResult.success;
                }

                return {
                    "failed": true,
                    "failureMessage": "A value is required."
                };
            },
                ruleResultFunction = function () {
                    var value = this.observableOrComputed();

                    return this.options.rule.test(value);
                },
                resultFunction = function () {
                    var result;

                    result = this.binding.result();
                    if (result.failed) {
                        return result;
                    }

                    result = missingResultFunction.apply(this);
                    if (result.failed) {
                        return result;
                    }

                    result = ruleResultFunction.apply(this);
                    if (result.failed) {
                        return result;
                    }

                    return knockout.ValidationResult.success;
                },
                failedFunction = function () {
                    var result = resultFunction.apply(this);

                    return result.failed;
                },
                messageFunction = function () {
                    var result = resultFunction.apply(this);

                    return result.failureMessage;
                },
                passedFunction = function () {
                    var result = resultFunction.apply(this);

                    return !result.failed;
                },
                showMessageFunction = function () {
                    return this.binding.result().failed ||
                        (this.options.context.submissionAttempted() && failedFunction.apply(this));
                };

            // Constructor Function
            // - validation state for a single observable or computed
            // - options can be modified using a fluent interface
            knockout.ValidationState = function (observableOrComputed, options) {
                options = utils.mergeOptions(knockout.ValidationState.defaultOptions, options);
                this.options = options;

                this.binding = {
                    "result": ko.observable(knockout.ValidationResult.success)
                };

                this.observableOrComputed = observableOrComputed;
                knockout.setState(observableOrComputed, this);

                this.failed = ko.computed(failedFunction, this, { "deferEvaluation": true });
                this.message = ko.computed(messageFunction, this, { "deferEvaluation": true });
                this.passed = ko.computed(passedFunction, this, { "deferEvaluation": true });
                this.result = ko.computed(resultFunction, this, { "deferEvaluation": true });
                this.showMessage = ko.computed(showMessageFunction, this, { "deferEvaluation": true });
            };
        })();

        knockout.ValidationState.prototype = {
            "end": function() {
                return this.observableOrComputed;
            },
            "inapplicable": function () {
                this.options.applicable = utils.asFunction(false);
                return this;
            },
            "required": function () {
                this.options.required = utils.asFunction(true);
                return this;
            }
        };

        knockout.ValidationState.defaultOptions = {
            "applicable": utils.asFunction(true),
            "context": knockout.ValidationContext.defaultContext,
            "converter": converters.passThrough,
            "missingTest": utils.isMissing,
            "required": utils.asFunction(false),
            "rule": rules.passThrough
        };
    })();

    // Initialises the valerie.knockout library.
    // - the name of the extension function attached to observables and computeds can be defined
    knockout.initialise = function (initialisationOptions) {
        var fnName,
            validationFunction;

        initialisationOptions = utils.mergeOptions({
            "fnName": "validation"
        }, initialisationOptions);

        // The extension function attached to observables and computeds to read or initialise the validation state.
        validationFunction = function (validationOptions) {
            var state = knockout.getState(this);

            // Return any existing validation state.
            if (state) {
                return state;
            }

            state = new knockout.ValidationState(this, validationOptions);

            // Return the validation state after creation, so it can be modified fluently.
            return state;
        };

        fnName = initialisationOptions.fnName;
        ko.observable.fn[fnName] = ko.computed.fn[fnName] = validationFunction;
    };
})();