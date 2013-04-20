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

(function() {
    "use strict";

    var converters = valerie.converters,
        utils = valerie.utils,
        rules = valerie.rules,
        knockout = valerie.knockout;

    // ValidationResult
    // - the result of a validation test
    knockout.ValidationResult = function(failed, failureMessage) {
        this.failed = failed;
        this.failureMessage = failureMessage;
    };

    knockout.ValidationResult.success = new knockout.ValidationResult(false, "");

    // PropertyValidationState
    // - validation state for a single observable or computed property
    (function() {
        var missingResultFunction = function() {
            var value = this.observableOrComputed();

            if (!this.options.required() || !this.options.missingTest(value)) {
                return knockout.ValidationResult.success;
            }

            return {
                "failed": true,
                "failureMessage": this.options.missingFailureMessage
            };
        },
            ruleResultFunction = function() {
                var value = this.observableOrComputed();

                return this.options.rule.test(value);
            },
            resultFunction = function() {
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
            failedFunction = function() {
                var result = resultFunction.apply(this);

                return result.failed;
            },
            messageFunction = function() {
                var result = resultFunction.apply(this);

                return result.failureMessage;
            },
            passedFunction = function() {
                var result = resultFunction.apply(this);

                return !result.failed;
            },
            showState = function() {
                return this.boundEntry.result().failed ||
                    (this.touched() && failedFunction.apply(this));
            },
            statePropertyName = "__valerie.knockout.PropertyValidationState";

        // Constructor Function
        // - options can be modified using a fluent interface
        knockout.PropertyValidationState = function(observableOrComputed, options) {
            options = utils.mergeOptions(knockout.PropertyValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.required = utils.asFunction(options.required);

            this.boundEntry = {
                "focused": ko.observable(false),
                "result": ko.observable(knockout.ValidationResult.success),
                "textualInput": false
            };

            this.failed = ko.computed(failedFunction, this, { "deferEvaluation": true });
            this.message = knockout.extras.pausableComputed(messageFunction, this, { "deferEvaluation": true });
            this.observableOrComputed = observableOrComputed;
            this.options = options;
            this.passed = ko.computed(passedFunction, this, { "deferEvaluation": true });
            this.result = ko.computed(resultFunction, this, { "deferEvaluation": true });
            this.showState = knockout.extras.pausableComputed(showState, this, { "deferEvaluation": true });
            this.touched = ko.observable(false);
        };

        // Add methods for modifying state in a fluent manner.
        knockout.PropertyValidationState.prototype = {
            "applicable": function(valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.options.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "between": function(minimumValueOrFunction, maximumValueOrFunction) {
                this.options.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction);

                return this;
            },
            "end": function() {
                return this.observableOrComputed;
            },
            "integer": function() {
                this.options.converter = converters.integer;

                return this;
            },
            "required": function(valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.options.required = utils.asFunction(valueOrFunction);

                return this;
            }
        };

        // Define default options.
        knockout.PropertyValidationState.defaultOptions = {
            "applicable": utils.asFunction(true),
            "converter": converters.passThrough,
            "invalidEntryFailureMessage": "The value entered is invalid.",
            "missingFailureMessage": "A value is required.",
            "missingTest": utils.isMissing,
            "required": utils.asFunction(false),
            "rule": rules.passThrough,
            "valueFormat": undefined
        };

        // Define functions for getting, setting and testing the existence of the underlying validation state.
        knockout.PropertyValidationState.getState = function(observableOrComputed) {
            return observableOrComputed[statePropertyName];
        };

        knockout.PropertyValidationState.hasState = function(observableOrComputed) {
            return observableOrComputed.hasOwnProperty(statePropertyName);
        };


        knockout.PropertyValidationState.setState = function(observableOrComputed, state) {
            observableOrComputed[statePropertyName] = state;
        };
    })();

    var extensionFunctionName = "validation";

    ko.observable.fn[extensionFunctionName] = ko.computed.fn[extensionFunctionName] = function(validationOptions) {
        var state = knockout.PropertyValidationState.getState(this);

        // Return any existing validation state.
        if (state) {
            return state;
        }

        state = new knockout.PropertyValidationState(this, validationOptions);
        knockout.PropertyValidationState.setState(this, state);

        // Return the validation state after creation, so it can be modified fluently.
        return state;
    };
})();
