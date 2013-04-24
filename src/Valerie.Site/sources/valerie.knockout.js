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
        deferEvaluation = { "deferEvaluation": true },
        getValidationStateMethodName = "validation";

    // + getValidationState
    // - gets the validation state from a model, observable or computed
    // - for use when developing bindings
    knockout.getValidationState = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed === undefined || modelOrObservableOrComputed === null) {
            return undefined;
        }

        if (!modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName)) {
            return undefined;
        }

        return modelOrObservableOrComputed[getValidationStateMethodName]();
    };

    // + hasValidationState
    // - determines if the given model, observable or computed has a validation state
    // - for use when developing bindings
    knockout.hasValidationState = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed === undefined || modelOrObservableOrComputed === null) {
            return false;
        }

        return modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName);
    };

    // + setValidationState
    // - sets the validation state on the model, observable or computed
    // - for use when configuring validation in a non-fluent manner
    knockout.setValidationState = function (modelOrObservableOrComputed, state) {
        modelOrObservableOrComputed[getValidationStateMethodName] = function () {
            return state;
        };
    };

    // + findValidationStates
    // - finds and returns the validation states of:
    //   - properties for the given model
    //   - sub-models of the given model, if permitted
    //   - descendant properties and sub-models of the given model, if requested
    knockout.findValidationStates = function (model, includeSubModels, recurse, validationStates) {

        if (arguments.length < 4) {
            validationStates = [];
        }

        if (arguments.length < 3) {
            recurse = false;
        }

        if (arguments.length < 2) {
            includeSubModels = true;
        }

        var name,
            validationState,
            value;

        for (name in model) {
            if (model.hasOwnProperty(name)) {
                value = model[name];

                if (value === undefined || value === null) {
                    continue;
                }

                validationState = knockout.getValidationState(value);

                if (ko.isObservable(value)) {
                    value = value.peek();
                }

                if (utils.isFunction(value)) {
                    continue;
                }

                if (utils.isArrayOrObject(value)) {
                    if (includeSubModels && validationState) {
                        validationStates.push(validationState);
                    }

                    if (recurse) {
                        knockout.findValidationStates(value, includeSubModels, true, validationStates);
                    }
                } else {
                    if (validationState) {
                        validationStates.push(validationState);
                    }
                }
            }
        }

        return validationStates;
    };

    // + validatableModel
    // - makes the model passed in validatable
    knockout.validatableModel = function (model, options) {
        var validationState = new knockout.ModelValidationState(model, options);

        knockout.setValidationState(model, validationState);

        // Return the validation state so it can be used in a fluent manner.
        return validationState;
    };

    // + validatableProperty
    // - makes the observable, observable array or computed passed in validatable
    knockout.validatableProperty = function (observableOrComputed, options) {
        if (!ko.isSubscribable(observableOrComputed)) {
            throw "Only observables or computeds can be made validatable properties.";
        }

        var validationState = new knockout.PropertyValidationState(observableOrComputed, options);

        knockout.setValidationState(observableOrComputed, validationState);

        // Return the validation state so it can be used in a fluent manner.
        return validationState;
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
        var failedFunction = function() {
            return this.result().failed;
        },
            invalidStatesFunction = function() {
                return this.result().data;
            },
            messageFunction = function() {
                return this.result().failureMessage;
            },
            passedFunction = function() {
                return !this.result().failed;
            },
            resultFunction = function() {
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
            };

        knockout.ModelValidationState = function (model, options) {
            options = utils.mergeOptions(knockout.ModelValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);

            this.failed = ko.computed(failedFunction, this, deferEvaluation);
            this.invalidStates = ko.computed(invalidStatesFunction, this, deferEvaluation);
            this.message = ko.computed(messageFunction, this, deferEvaluation);
            this.model = model;
            this.options = options;
            this.passed = ko.computed(passedFunction, this, deferEvaluation);
            this.result = knockout.extras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);
            this.touched = ko.observable(false);
            this.validationStates = ko.observableArray();

            this.paused = this.result.paused;
            this.refresh = this.result.refresh;
        };

        // Add methods for modifying the state in a fluent manner.
        knockout.ModelValidationState.prototype = {
            "addValidationStates": function (validationStates) {
                this.validationStates.push.apply(this.validationStates, validationStates);
            },
            "end": function () {
                return this.model;
            },
            "name": function (valueOrFunction) {
                this.options.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "removeValidationStates": function (validationStates) {
                this.validationStates.removeAll(validationStates);
            },
            "stopValidatingSubModel": function (validatableSubModel) {
                this.validationStates.removeAll(validatableSubModel.validation().validationStates.peek());
            },
            "touch": function () {
                var index,
                    validationStates = this.validationStates.peek();

                for (index = 0; index < validationStates.length; index++) {
                    validationStates[index].touch();
                }

                this.touched(true);

                return this;
            },
            "validateAll": function () {
                var validationStates = knockout.findValidationStates(this.model, true, true);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateAllProperties": function () {
                var validationStates = knockout.findValidationStates(this.model, false, true);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateMyProperties": function () {
                var validationStates = knockout.findValidationStates(this.model, false, false);
                this.addValidationStates(validationStates);

                return this;
            },
            "validateMyPropertiesAndSubModels": function () {
                var validationStates = knockout.findValidationStates(this.model, true, false);
                this.addValidationStates(validationStates);

                return this;
            }
        };

        knockout.ModelValidationState.defaultOptions = {
            "applicable": utils.asFunction(true),
            "failureMessageFormat": "There are {failureCount} validation errors." /*resource*/,
            "name": utils.asFunction("(no-name-set)"),
            "paused": undefined
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
                return this.result().failed;
            },
            messageFunction = function () {
                return this.result().failureMessage;
            },
            passedFunction = function () {
                return !this.result().failed;
            },
            showStateFunction = function () {
                if (!this.options.applicable()) {
                    return false;
                }

                return this.boundEntry.result().failed ||
                    (this.touched() && this.result().failed);
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
            this.showState = knockout.extras.pausableComputed(showStateFunction, this, deferEvaluation);
            this.touched = ko.observable(false);
        };

        // Add methods for modifying state in a fluent manner.
        knockout.PropertyValidationState.prototype = {
            "applicable": function (valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.options.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "between": function (minimumValueOrFunction, maximumValueOrFunction) {
                this.options.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction);

                return this;
            },
            "end": function () {
                this.options.rule.options.valueFormat = this.options.valueFormat;
                this.options.rule.options.valueFormatter = this.options.converter.formatter;

                return this.observableOrComputed;
            },
            "integer": function () {
                this.options.converter = converters.integer;

                return this;
            },
            "name": function (valueOrFunction) {
                this.options.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "required": function (valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.options.required = utils.asFunction(valueOrFunction);

                return this;
            },
            "touch": function () {
                this.touched(true);

                return this;
            }
        };

        // Define default options.
        knockout.PropertyValidationState.defaultOptions = {
            "applicable": utils.asFunction(true),
            "converter": converters.passThrough,
            "entryFormat": undefined,
            "invalidEntryFailureMessage": "The value entered is invalid.", /*resource*/
            "missingFailureMessage": "A value is required.", /*resource*/
            "missingTest": utils.isMissing,
            "name": utils.asFunction(),
            "required": utils.asFunction(false),
            "rule": new rules.PassThrough,
            "valueFormat": undefined
        };
    })();

    // + validate extension function
    // - creates and returns the validation state for an observable or computed
    ko.observable.fn["validate"] = ko.computed.fn["validate"] = function (validationOptions) {

        // Create the validation state, then return it, so it can be modified fluently.
        return knockout.validatableProperty(this, validationOptions);
    };
})();
