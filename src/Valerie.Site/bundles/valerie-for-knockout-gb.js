///#source 1 1 ../bundles/valerie-for-knockout.license.js
"valerie for knockout (c) 2013 egrove Ltd. License: MIT (http://www.opensource.org/licenses/mit-license.php)";
///#source 1 1 ../sources/valerie.utils.js
// valerie.utils
// - general purpose utilities
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
var valerie = valerie || {};

(function () {
    "use strict";

    var utils = valerie.utils = valerie.utils || {};

    // + utils.asArray
    utils.asArray = function (valueOrArray) {
        if (utils.isArray(valueOrArray)) {
            return valueOrArray;
        }

        return [valueOrArray];
    };

    // + utils.asFunction
    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };

    // + utils.formatString
    utils.formatString = function (format, replacements) {
        if (replacements === undefined || replacements === null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement === undefined || replacement === null) {
                return match;
            }

            return replacement.toString();
        });
    };

    // + utils.isArray
    utils.isArray = function (value) {
        return {}.toString.call(value) === "[object Array]";
    };

    // + utils.isArrayOrObject
    utils.isArrayOrObject = function(value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

    // + utils.isFunction
    utils.isFunction = function (value) {
        if (value === undefined || value === null) {
            return false;
        }

        return (typeof value === "function");
    };

    // + utils.isMissing
    utils.isMissing = function (value) {
        if (value === undefined || value === null) {
            return true;
        }

        if (value.length === 0) {
            return true;
        }

        return false;
    };

    // + utils.isObject
    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }
        
        if(utils.isArray(value)) {
            return false;
        }

        return typeof value === "object";
    };

    // + utils.mergeOptions
    utils.mergeOptions = function (defaultOptions, options) {
        var mergedOptions = {},
            name;

        if (defaultOptions === undefined || defaultOptions === null) {
            defaultOptions = {};
        }

        if (options === undefined || options === null) {
            options = {};
        }

        for (name in defaultOptions) {
            if (defaultOptions.hasOwnProperty(name)) {
                mergedOptions[name] = defaultOptions[name];
            }
        }

        for (name in options) {
            if (options.hasOwnProperty(name)) {
                mergedOptions[name] = options[name];
            }
        }

        return mergedOptions;
    };
})();

///#source 1 1 ../sources/valerie.knockout.extras.js
// valerie.knockout.extras
// - extra functionality for KnockoutJS
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global ko: false, valerie: true */
if (typeof ko === "undefined") throw "KnockoutJS is required.";
var valerie = valerie || {};

(function () {
    "use strict";

    var knockout = valerie.knockout = valerie.knockout || {},
        extras = knockout.extras = knockout.extras || {};

    // + isolatedBindingHandler factory function
    // - creates a binding handler in which update is called only when a dependency changes and not when another
    //   binding changes
    extras.isolatedBindingHandler = function (initOrUpdateFunction, updateFunction) {
        var initFunction = (arguments.length === 1) ? function () {
        } : initOrUpdateFunction;
        updateFunction = (arguments.length === 2) ? updateFunction : initOrUpdateFunction;

        return {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                initFunction(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

                ko.computed({
                    "read": function () {
                        updateFunction(element, valueAccessor, allBindingsAccessor, viewModel,
                            bindingContext);
                    },
                    "disposeWhenNodeIsRemoved": element
                });
            }
        };
    };

    // + pausableComputed factory function
    // - creates a computed whose evaluation can be paused and unpaused
    extras.pausableComputed = function (evaluatorFunction, evaluatorFunctionTarget, options,
        pausedValueOrObservableOrComputed) {

        var lastValue,
            paused,
            computed;

        if (pausedValueOrObservableOrComputed === undefined || pausedValueOrObservableOrComputed === null) {
            paused = ko.observable(false);
        } else {
            paused = ko.utils.isSubscribable(pausedValueOrObservableOrComputed) ?
                pausedValueOrObservableOrComputed :
                ko.observable(pausedValueOrObservableOrComputed);
        }

        computed = ko.computed(function () {
            if (paused()) {
                return lastValue;
            }

            return evaluatorFunction.call(evaluatorFunctionTarget);
        }, evaluatorFunctionTarget, options);

        computed.paused = ko.computed({
            "read": function () {
                return paused();
            },
            "write": function (value) {
                value = (value == true);

                if (value === paused()) {
                    return;
                }

                if (value) {
                    lastValue = computed();
                }

                paused(value);
            }
        });

        computed.refresh = function () {
            if (!paused()) {
                return;
            }

            paused(false);
            lastValue = computed();
            paused(true);
        };

        return computed;
    };
})();

///#source 1 1 ../sources/valerie.dom.js
// valerie.dom
// - utilities for working with the document object model
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
var valerie = valerie || {};

(function () {
    "use strict";

    var dom = valerie.dom = valerie.dom || {};

    // + setElementVisibility
    // - sets the visibility of the given DOM element
    dom.setElementVisibility = function (element, newVisibility) {
        var currentVisibility = (element.style.display !== "none");
        if (currentVisibility === newVisibility) {
            return;
        }

        element.style.display = (newVisibility) ? "" : "none";
    };
})();

///#source 1 1 ../sources/valerie.converters.js
// valerie.converters
// - general purpose converters
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {};

    // + converters.integer
    converters.integer = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            // ToDo: Change this very simple, permissive implementation.
            var parsedValue = parseInt(value, 10);

            if (isNaN(parsedValue)) {
                return undefined;
            }

            return parsedValue;
        }
    };

    // + converters.passThrough
    converters.passThrough = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            return value;
        }
    };

    // + converters.string
    converters.string = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value;
        },

        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            return value;
        }
    };
})();

///#source 1 1 ../sources/valerie.converters.gb.js
// valerie.converters.gb
// - converters for types particular to Great Britain
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
var valerie = valerie || {};


(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {};

    // + converters.money
    converters.money = {
        "formatter": function (value, format) {
            if (value === undefined || value === null) {
                return "";
            }

            if (format === undefined || format === null) {
                format = "";
            }

            // ToDo: Change this very simple implementation.
            return format + value.toString();
        },
        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            value = value.replace("£", "");
            
            // ToDo: Change this very simple, permissive implementation.
            var parsedValue = parseFloat(value);

            if (isNaN(parsedValue)) {
                return undefined;
            }

            return parsedValue;
        }
    };
})();

///#source 1 1 ../sources/valerie.rules.js
// valerie.rules
// - general purpose rules
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.utils.js"/>

/*global valerie: false */
if (typeof valerie === "undefined" || !valerie.utils) throw "valerie.utils is required.";

(function () {
    "use strict";

    var rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils;

    // ToDo: During (Range for dates and times).

    // + rules.PassThrough
    rules.PassThrough = function() {
        this.options = {};
    };

    rules.PassThrough.prototype = {
        "test": function() {
            return rules.successfulTestResult;
        }
    };

    // + rules.Range
    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "2 or 3 arguments expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.options = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormatForMinimumOnly": "The value must be no less than {minimum}.", /*resource*/
        "failureMessageFormatForMaximumOnly": "The value must be no greater than {maximum}.", /*resource*/
        "failureMessageFormatForRange": "The value must be between {minimum} and {maximum}.", /*resource*/
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function (value) {
            var failureMessage,
                failureMessageFormat = this.options.failureMessageFormatForRange,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum !== undefined && maximum !== null,
                haveMinimum = minimum !== undefined && minimum !== null,
                haveValue = value !== undefined && value !== null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return rules.successfulTestResult;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.options.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.options.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return rules.successfulTestResult;
            }

            failureMessage = utils.formatString(
                failureMessageFormat, {
                    "maximum": this.options.valueFormatter(maximum, this.options.valueFormat),
                    "minimum": this.options.valueFormatter(minimum, this.options.valueFormat),
                    "value": this.options.valueFormatter(value, this.options.valueFormat)
                });

            return {
                "failed": true,
                "failureMessage": failureMessage
            };
        }
    };

    rules.successfulTestResult = {
        "failed": false,
        "failureMessage": ""
    };
})();

///#source 1 1 ../sources/valerie.knockout.js
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

                knockout.findValidationStates(value, true, validationStates);
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

///#source 1 1 ../sources/valerie.knockout.gb.js
// valerie.knockout.gb
// - additional fluent methods for using converters particular to Great Britain
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.knockout.js"/>

/*global valerie: false */
if (typeof valerie === "undefined" || !valerie.utils) throw "valerie.utils is required.";
if (!valerie.knockout) throw "valerie.knockout is required.";

(function () {
    "use strict";

    var converters = valerie.converters,
        utils = valerie.utils,
        moneyDefaultOptions = {
            "entryFormat": undefined,
            "valueFormat": "£"
        };

    valerie.knockout.PropertyValidationState.prototype.money = function (options) {
        options = utils.mergeOptions(moneyDefaultOptions, options);

        this.options.entryFormat = options.entryFormat;
        this.options.valueFormat = options.valueFormat;
        this.options.converter = converters.money;

        return this;
    };

    valerie.knockout.PropertyValidationState.prototype.money.defaultOptions = moneyDefaultOptions;
})();

///#source 1 1 ../sources/valerie.knockout.bindings.js
// valerie.knockout.bindings
// - knockout bindings for:
//   - validating user entries
//   - showing the validation state of a view-model
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.knockout.extras.js"/>
/// <reference path="valerie.dom.js"/>
/// <reference path="valerie.knockout.js"/>

/*global ko: false, valerie: false */
if (typeof ko === "undefined") throw "KnockoutJS is required.";
if (typeof valerie === "undefined" || !valerie.dom) throw "valerie.dom is required.";
if (!valerie.knockout) throw "valerie.knockout is required.";
if (!valerie.knockout.extras) throw "valerie.knockout.extras is required.";

(function () {
    "use strict";

    var utils = valerie.utils,
        knockout = valerie.knockout;

    // Define validatedChecked and validatedValue binding handlers.
    (function () {
        var checkedBindingHandler = ko.bindingHandlers.checked,
            validatedCheckedBindingHandler,
            valueBindingHandler = ko.bindingHandlers.value,
            validatedValueBindingHandler,
            blurHandler = function (element, observableOrComputed) {
                var validationState = knockout.getValidationState(observableOrComputed);

                validationState.touched(true);
                validationState.boundEntry.focused(false);
                validationState.message.paused(false);
                validationState.showState.paused(false);
            },
            textualInputBlurHandler = function (element, observableOrComputed) {
                var validationState = knockout.getValidationState(observableOrComputed),
                    value;

                if (validationState.boundEntry.result.peek().failed) {
                    return;
                }

                value = observableOrComputed.peek();
                element.value = validationState.options.converter.formatter(value, validationState.options.entryFormat);
            },
            textualInputFocusHandler = function (element, observableOrComputed) {
                var validationState = knockout.getValidationState(observableOrComputed);

                validationState.boundEntry.focused(true);
                validationState.message.paused(true);
                validationState.showState.paused(true);
            },
            textualInputKeyUpHandler = function (element, observableOrComputed) {
                var enteredValue = ko.utils.stringTrim(element.value),
                    parsedValue,
                    validationState = knockout.getValidationState(observableOrComputed),
                    options = validationState.options;

                if (enteredValue.length === 0 && options.required()) {
                    observableOrComputed(undefined);

                    validationState.boundEntry.result(new knockout.ValidationResult(true,
                        options.missingFailureMessage));

                    return;
                }

                parsedValue = options.converter.parser(enteredValue);
                observableOrComputed(parsedValue);

                if (parsedValue === undefined) {
                    validationState.boundEntry.result(new knockout.ValidationResult(true,
                        options.invalidEntryFailureMessage));

                    return;
                }

                validationState.boundEntry.result(knockout.ValidationResult.success);
            },
            textualInputUpdateFunction = function (observableOrComputed, validationState, element) {
                // Get the value so this function becomes dependent on the observable or computed.
                var value = observableOrComputed();

                // Prevent a focused element from being updated by the model.
                if (validationState.boundEntry.focused.peek()) {
                    return;
                }

                validationState.boundEntry.result(knockout.ValidationResult.success);

                element.value = validationState.options.converter.formatter(value, validationState.options.entryFormat);
            };

        // + validatedChecked binding handler
        // - functions in the same way as the "checked" binding handler
        // - registers a blur event handler so validation messages for missing selections can be displayed
        validatedCheckedBindingHandler = ko.bindingHandlers.validatedChecked = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = knockout.getValidationState(observableOrComputed);

                checkedBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);

                if (validationState) {
                    ko.utils.registerEventHandler(element, "blur", function () {
                        blurHandler(element, observableOrComputed);
                    });

                    if (validationState.options.name() === undefined) {
                        validationState.options.name = utils.asFunction(element.name);
                    }
                }
            },
            "update": checkedBindingHandler.update
        };

        // + validatedValue binding handler
        // - with the exception of textual inputs, functions in the same way as the "value" binding handler
        // - registers a blur event handler so validation messages for completed entries or selections can be displayed
        // - registers a blur event handler to reformat parsed textual entries
        validatedValueBindingHandler = ko.bindingHandlers.validatedValue = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    tagName = ko.utils.tagNameLower(element),
                    textualInput,
                    validationState = knockout.getValidationState(observableOrComputed);

                if (!validationState) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                if (validationState.options.name() === undefined) {
                    validationState.options.name = utils.asFunction(element.name);
                }

                ko.utils.registerEventHandler(element, "blur", function () {
                    blurHandler(element, observableOrComputed);
                });

                textualInput = (tagName === "input" && element.type.toLowerCase() === "text") || tagName === "textarea";

                if (!textualInput) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                validationState.boundEntry.textualInput = true;

                ko.utils.registerEventHandler(element, "blur", function () {
                    textualInputBlurHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "focus", function () {
                    textualInputFocusHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "keyup", function () {
                    textualInputKeyUpHandler(element, observableOrComputed);
                });

                // Rather than update the textual input in the "update" method we use a computed to ensure the textual
                // input's value is changed only when the observable or computed is changed, not when another binding is
                // changed.
                ko.computed({
                    "read": function () {
                        textualInputUpdateFunction(observableOrComputed, validationState, element);
                    },
                    "disposeWhenNodeIsRemoved": element
                });
            },
            "update": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = knockout.getValidationState(observableOrComputed);

                if (validationState && validationState.boundEntry.textualInput) {
                    return;
                }

                valueBindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);
            }
        };

        // + originalBindingHandlers
        // - record the original binding handlers
        knockout.originalBindingHandlers = {
            "checked": checkedBindingHandler,
            "value": valueBindingHandler
        };

        // + validatingBindingHandlers
        // - the validating binding handlers
        knockout.validatingBindingHandlers = {
            "checked": validatedCheckedBindingHandler,
            "value": validatedValueBindingHandler
        };

        // + useValidatingBindingHandlers
        // - replaces the original "checked" and "value" binding handlers with validating equivalents
        knockout.useValidatingBindingHandlers = function () {
            ko.bindingHandlers.checked = validatedCheckedBindingHandler;
            ko.bindingHandlers.value = validatedValueBindingHandler;
            ko.bindingHandlers.koChecked = checkedBindingHandler;
            ko.bindingHandlers.koValue = valueBindingHandler;

            // Allow configuration changes to be made fluently.
            return knockout;
        };

        // + useOriginalBindingHandlers
        // - restores the original "checked" and "value" binding handlers
        knockout.useOriginalBindingHandlers = function () {
            ko.bindingHandlers.checked = checkedBindingHandler;
            ko.bindingHandlers.value = valueBindingHandler;

            // Allow configuration changes to be made fluently.
            return knockout;
        };
    })();

    // applicability binding handlers
    ko.bindingHandlers.enableWhenApplicable = knockout.extras.isolatedBindingHandler(
        function (element, valueAccessor, allBindingsAccessor) {
            var bindings,
                value = valueAccessor(),
                validationState;

            if (value === true) {
                bindings = allBindingsAccessor();
                value = bindings.value || bindings.checked || bindings.validatedValue || bindings.validatedChecked;
            }

            validationState = knockout.getValidationState(value);

            if (validationState) {
                element.disabled = !validationState.options.applicable();
            }
        });

    // visibility binding handlers
    (function () {
        var visibleDependingOnValidity = function (element, valueAccessor, determineVisibilityFunction) {
            var newVisibility,
                observableOrComputed = valueAccessor(),
                validationState = knockout.getValidationState(observableOrComputed);

            if (validationState) {
                newVisibility = determineVisibilityFunction(validationState);
                valerie.dom.setElementVisibility(element, newVisibility);
            }
        };

        // + visibleWhenInvalid binding handler
        // - makes the bound element visible if the value is invalid, invisible otherwise
        ko.bindingHandlers.visibleWhenInvalid = knockout.extras.isolatedBindingHandler(
            function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.failed();
                });
            });

        // + visibleWhenValid binding handler
        // - makes the bound element visible if the value is valid, invisible otherwise
        ko.bindingHandlers.visibleWhenValid = knockout.extras.isolatedBindingHandler(
            function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.passed();
                });
            });
    })();

    // + validationMessageFor binding handler
    // - makes the bound element visible if the value is invalid
    // - sets the text of the bound element to be the validation message
    ko.bindingHandlers.validationMessageFor = knockout.extras.isolatedBindingHandler(
        function (element, valueAccessor) {
            var observableOrComputed = valueAccessor(),
                validationState = knockout.getValidationState(observableOrComputed);

            if (validationState) {
                valerie.dom.setElementVisibility(element, validationState.showState());
                ko.utils.setTextContent(element, validationState.message());
            }
        });
})();

