// valerie.knockout
// - the class and functions that validate a view-model constructed using knockout observables and computeds
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.knockout.extras.js"/>
/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.converters.js"/>
/// <reference path="valerie.rules.js"/>

/*global ko: false, valerie: false */
if (typeof ko === "undefined") throw "KnockoutJS is required.";
if (typeof valerie === "undefined" || !valerie.utils) throw "valerie.utils is required.";
if (!valerie.converters) throw "valerie.converters is required.";
if (!valerie.rules) throw "valerie.rules is required.";
if (!valerie.knockout || !valerie.knockout.extras) throw "valerie.knockout.extras is required.";

(function () {
    "use strict";

    var converters = valerie.converters,
        utils = valerie.utils,
        rules = valerie.rules,
        knockout = valerie.knockout,
        validationStatePropertyName = "__valerie.knockout.validationState",
        getThisValidationState = function () {
            return this[validationStatePropertyName];
        },
        deferEvaluation = { "deferEvaluation": true };

    // + getValidationState
    // - gets the validation state from a model, observable or computed
    // - for use when developing bindings
    knockout.getValidationState = function (modelOrObservableOrComputed) {
        return modelOrObservableOrComputed[validationStatePropertyName];
    };

    // + hasValidationState
    // - determines if the given model, observable or computed has a validation state
    // - for use when developing bindings
    knockout.hasValidationState = function (modelOrObservableOrComputed) {
        return modelOrObservableOrComputed.hasOwnProperty(validationStatePropertyName);
    };

    // + setValidationState
    // - sets the validation state for a model, observable or computed
    // - for use when developing bindings
    knockout.setValidationState = function (modelOrObservableOrComputed, state) {
        modelOrObservableOrComputed[validationStatePropertyName] = state;
    };

    // + validatable
    // - makes the model passed in validatable
    knockout.validatableModel = function (model, options) {
        if (!utils.isObject(model)) {
            throw "Currently only objects can be made validatable models. " +
                "Arrays, observables and computeds are not supported.";
        }

        knockout.setValidationState(model, new knockout.ModelValidationState(options));
        model.validation = getThisValidationState;

        // Return the model so it can be modified in a fluent manner.
        return model;
    };

    // + ValidationResult
    // - the result of a validation test
    knockout.ValidationResult = function (failed, failureMessage, data) {
        this.failed = failed;
        this.failureMessage = failureMessage;
        this.data = data;
    };

    knockout.ValidationResult.success = new knockout.ValidationResult(false, "", []);

    // + ModelValidationState
    // - validation state for a model
    // - the model may comprise of simple or complex properties
    (function () {
        var resultFunction = function () {
            var failures = [],
                index,
                result,
                validationState,
                validationStates = this.validationStates();

            for (index = 0; index < validationStates.length; index++) {
                validationState = validationStates[index];

                if (validationState.options.applicable()) {
                    result = validationStates[index].result();

                    if (result.failed) {
                        failures.push(validationState);
                    }
                }
            }

            if (failures.length === 0) {
                return knockout.ValidationResult.success;
            }

            return new knockout.ValidationResult(
                true,
                utils.formatString(this.options.failureMessageFormat, { "failureCount": failures.length }),
                failures
            );
        },
            failedFunction = function () {
                var result = resultFunction.apply(this);

                return result.failed;
            };

        knockout.ModelValidationState = function (options) {
            options = utils.mergeOptions(knockout.ModelValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);

            this.failed = ko.computed(failedFunction, this, deferEvaluation);
            this.options = options;
            this.result = knockout.extras.pausableComputed(resultFunction, this, deferEvaluation);
            this.validationStates = ko.observableArray();
        };

        knockout.ModelValidationState.defaultOptions = {
            "applicable": utils.asFunction(true),
            "failureMessageFormat": "There are {failureCount} validation errors." /*resource*/
        };
    })();

    // + PropertyValidationState
    // - validation state for a single, simple, observable or computed property
    (function () {
        var missingResultFunction = function () {
            var value = this.observableOrComputed();

            if (!this.options.required() || !this.options.missingTest(value)) {
                return knockout.ValidationResult.success;
            }

            return {
                "failed": true,
                "failureMessage": this.options.missingFailureMessage
            };
        },
            ruleResultFunction = function () {
                var value = this.observableOrComputed();

                return this.options.rule.test(value);
            },
            resultFunction = function () {
                var result;

                result = this.boundEntry.result();
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
            showState = function () {
                if (!this.options.applicable()) {
                    return false;
                }

                return this.boundEntry.result().failed ||
                    (this.touched() && failedFunction.apply(this));
            };

        // Constructor Function
        // - options can be modified using a fluent interface
        knockout.PropertyValidationState = function (observableOrComputed, options) {
            options = utils.mergeOptions(knockout.PropertyValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);
            options.required = utils.asFunction(options.required);

            this.boundEntry = {
                "focused": ko.observable(false),
                "result": ko.observable(knockout.ValidationResult.success),
                "textualInput": false
            };

            this.failed = ko.computed(failedFunction, this, deferEvaluation);
            this.message = knockout.extras.pausableComputed(messageFunction, this, deferEvaluation);
            this.observableOrComputed = observableOrComputed;
            this.options = options;
            this.passed = ko.computed(passedFunction, this, deferEvaluation);
            this.result = ko.computed(resultFunction, this, deferEvaluation);
            this.showState = knockout.extras.pausableComputed(showState, this, deferEvaluation);
            this.touched = ko.observable(false);
        };

        // Add methods for modifying state in a fluent manner.
        knockout.PropertyValidationState.prototype = {
            "applicable": function (valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.options.applicable = valueOrFunction;

                return this;
            },
            "between": function (minimumValueOrFunction, maximumValueOrFunction) {
                this.options.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction);

                return this;
            },
            "end": function () {
                return this.observableOrComputed;
            },
            "integer": function () {
                this.options.converter = converters.integer;

                return this;
            },
            "name": function(valueOrFunction) {
                this.options.name = valueOrFunction;
            },
            "required": function (valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.options.required = utils.asFunction(valueOrFunction);

                return this;
            }
        };

        // Define default options.
        knockout.PropertyValidationState.defaultOptions = {
            "applicable": true,
            "converter": converters.passThrough,
            "invalidEntryFailureMessage": "The value entered is invalid.", /*resource*/
            "missingFailureMessage": "A value is required.", /*resource*/
            "missingTest": utils.isMissing,
            "required": false,
            "rule": rules.passThrough,
            "valueFormat": undefined
        };
    })();

    (function () {
        var extensionFunctionName = "validation";

        // + validation extension function
        // - extends observables and computeds, creates or retrieves the validation state for an observable or computed
        ko.observable.fn[extensionFunctionName] = ko.computed.fn[extensionFunctionName] = function (validationOptions) {
            var state = knockout.getValidationState(this);

            // Return any existing validation state.
            if (state) {
                return state;
            }

            state = new knockout.PropertyValidationState(this, validationOptions);
            knockout.setValidationState(this, state);

            // Return the validation state after creation, so it can be modified fluently.
            return state;
        };
    })();
})();
