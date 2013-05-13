// valeriejs
// A validation library for KnockoutJS.
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/**
 * The valerie namespace.
 * @namespace valerie
 */
var valerie = {};

(function () {
    "use strict";

    /**
     * Contains general purpose utilities.
     * @namespace valerie.utils
     * @inner
     */
    var utils = valerie.utils = {};

    /**
     * Creates a function that returns the given value, or simply returns the given value if it is already a function.
     * @memberof valerie.utils
     * @param {*|function} valueOrFunction the value or function
     * @return {function} a newly created function, or the function passed in
     */
    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };

    /**
     * Tests whether the given value is an array.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an array
     */
    utils.isArray = function (value) {
        return {}.toString.call(value) === "[object Array]";
    };

    /**
     * Tests whether the given value is an array or object.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an array or an object
     */
    utils.isArrayOrObject = function (value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

    /**
     * Tests whether the given value is a function.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is a function
     */
    utils.isFunction = function (value) {
        if (value == null) {
            return false;
        }

        return (typeof value === "function");
    };

    /**
     * Tests whether the given value is "missing".
     * <code>undefined</code>, <code>null</code>, an empty string or an empty array are considered to be "missing".
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the value is missing
     */
    utils.isMissing = function (value) {
        if (value == null) {
            return true;
        }

        if (value.length === 0) {
            return true;
        }

        return false;
    };

    /**
     * Tests whether the given value is an object.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an object
     */
    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }

        if (utils.isArray(value)) {
            return false;
        }

        return typeof value === "object";
    };

    /**
     * Tests whether the give value is a string.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is a string
     */
    utils.isString = function (value) {
        return {}.toString.call(value) === "[object String]";
    };

    /**
     * Merges the given default options with the given options.
     * <ul>
     *     <li>either parameter can be omitted and a clone of the other parameter will be returned</li>
     *     <li>the merge is shallow</li>
     *     <li>array properties are shallow cloned</li>
     * </ul>
     * @memberof valerie.utils
     * @param {{}} defaultOptions the default options
     * @param {{}} options the options
     * @return {{}} the merged options
     */
    utils.mergeOptions = function (defaultOptions, options) {
        var mergedOptions = {},
            name,
            value;

        if (defaultOptions == null) {
            defaultOptions = {};
        }

        if (options == null) {
            options = {};
        }

        for (name in defaultOptions) {
            if (defaultOptions.hasOwnProperty(name)) {
                value = defaultOptions[name];

                if (utils.isArray(value)) {
                    value = value.slice(0);
                }

                mergedOptions[name] = value;
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

(function () {
    "use strict";

    /**
     * Contains utilities for formatting strings.
     * @namespace valerie.formatting
     * @inner
     */
    var formatting = valerie.formatting = {};

    /**
     * Adds thousands separators to the given number string.
     * @memberof valerie.formatting
     * @param {string} numberString a string representation of a number
     * @param {char|string} thousandsSeparator the character to use to separate the thousands
     * @param {char|string} decimalSeparator the character used to separate the whole part of the number from its fractional part
     * @return {string} the number string with separators added if required
     */
    formatting.addThousandsSeparator = function (numberString, thousandsSeparator, decimalSeparator) {
        var wholeAndFractionalParts = numberString.toString().split(decimalSeparator),
            wholePart = wholeAndFractionalParts[0];

        wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        wholeAndFractionalParts[0] = wholePart;

        return wholeAndFractionalParts.join(decimalSeparator);
    };

    /**
     * Pads the front of the given string to the given width using the given character.
     * @memberof valerie.formatting
     * @param {string} stringToPad the string to pad
     * @param {char|string} paddingCharacter the character to use to pad the string
     * @param {number} width the width to pad the string to
     * @return {string} the string padded, if required, to the given width
     */
    formatting.pad = function (stringToPad, paddingCharacter, width) {
        stringToPad = stringToPad.toString();

        if (stringToPad.length >= width) {
            return stringToPad;
        }

        return (new Array(width + 1 - stringToPad.length)).join(paddingCharacter) + stringToPad;
    };

    /**
     * Replaces placeholders in the given string with the given replacements.
     * @memberof valerie.formatting
     * @param {string} stringToFormat the string to format
     * @param {object|array} replacements a dictionary or array holding the replacements to use
     * @return {string} the formatted string with placeholders replaced where replacements have been specified
     */
    formatting.replacePlaceholders = function (stringToFormat, replacements) {
        if (replacements == null) {
            replacements = {};
        }

        return stringToFormat.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement == null) {
                return match;
            }

            return replacement.toString();
        });
    };
})();

(function () {
    "use strict";

    var dom,
        classNamesSeparatorExpression = /\s+/g,
        trimWhitespaceExpression = /^\s+|\s+$/g;

    /**
     * Contains utilities for working with the HTML document object model.
     * @namespace
     * @inner
     */
    valerie.dom = dom = {};

    /**
     * Builds and returns a dictionary of <code>true</code> values, keyed on the CSS class-names found in the given
     * string.
     * @memberof valerie.dom
     * @param {string} classNames the CSS class-names
     * @return {object} the dictionary
     */
    dom.classNamesStringToDictionary = function (classNames) {
        var array,
            dictionary = {},
            index;

        if (classNames == null) {
            return dictionary;
        }

        classNames = classNames.replace(trimWhitespaceExpression, "");

        if (classNames.length === 0) {
            return dictionary;
        }

        array = classNames.split(classNamesSeparatorExpression);

        for (index = 0; index < array.length; index++) {
            dictionary[array[index]] = true;
        }

        return dictionary;
    };

    /**
     * Builds and returns a CSS class-names string using the keys in the given dictionary which have <code>true</code>
     * values.
     * @memberof valerie.dom
     * @param {object} dictionary the dictionary of CSS class-names
     * @return {string} the CSS class-names
     */
    dom.classNamesDictionaryToString = function (dictionary) {
        var name,
            array = [];

        for (name in dictionary) {
            if (dictionary.hasOwnProperty(name)) {
                if (dictionary[name]) {
                    array.push(name);
                }
            }
        }

        array.sort();

        return array.join(" ");
    };

    /**
     * Sets the visibility of the given HTML element.
     * @memberof valerie.dom
     * @param {HTMLElement} element the element to set the visibility of
     * @param {boolean} newVisibility
     */
    dom.setElementVisibility = function (element, newVisibility) {
        var currentVisibility = (element.style.display !== "none");
        if (currentVisibility === newVisibility) {
            return;
        }

        element.style.display = (newVisibility) ? "" : "none";
    };
})();

(function () {
    "use strict";

    var states;

    /**
     * The result of a validation activity.
     * @constructor
     * @param {object} state the result state
     * @param {string} [message] a message from the activity
     * @property {object} state the result state
     * @property {boolean} failed - true if the activity failed validation
     * @property {boolean} passed - true if the activity passed validation
     * @property {boolean} pending - true if the activity hasn't yet completed
     * @property {string} message - a message from the activity
     */
    valerie.ValidationResult = function (state, message) {
        if(message == null) {
            message = "";
        }

        this.state = state;
        this.message = message;

        this.failed = state === states.failed;
        this.passed = state === states.passed;
        this.pending = state === states.pending;
    };

    /**
     * The possible states of a ValidationResult.
     * @name ValidationResult.states
     * @static
     */
    states = valerie.ValidationResult.states = {
        "failed": {},
        "passed": {},
        "pending": {}
    };

    /**
     * The result of an activity that failed validation.
     * @constructor
     * @param {string} [message] a message from the activity
     * @returns {valerie.ValidationResult}
     */
    valerie.FailedValidationResult = function (message) {
        return new valerie.ValidationResult(states.failed, message);
    };


    /**
     * The result of an activity that passed validation.
     * @constructor
     * @param {string} [message] a message from the activity
     * @returns {valerie.ValidationResult}
     */
    valerie.PassedValidationResult = function (message) {
        return new valerie.ValidationResult(states.passed, message);
    };

    /**
     * An instance of a PassedValidationResult.
     * @name PassedValidationResult.instance
     * @static
     */
    valerie.PassedValidationResult.instance = new valerie.PassedValidationResult();

    /**
     * The result of an activity which hasn't yet completed.
     * @constructor
     * @param {string} [message] a message from the activity
     * @returns {valerie.ValidationResult}
     */
    valerie.PendingValidationResult = function (message) {
        return new valerie.ValidationResult(states.pending, message);
    };

    /**
     * An instance of a PendingValidationResult.
     * @name PendingValidationResult.instance
     * @static
     */
    valerie.PendingValidationResult.instance = new valerie.PendingValidationResult();
})();

(function () {
    "use strict";

    /**
     * Contains converters. A converter is a static object which can parse string representations of a value type and
     * format values of a value type as a string.
     * @namespace
     * @inner
     */
    valerie.converters = valerie.converters || {};

    /**
     * A converter which formats and parses strings.
     * Used as the default converter in numerous places throughout the library.
     */
    valerie.converters.passThrough = {
        "formatter": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            return value;
        }
    };
})();

(function () {
    "use strict";

    valerie.knockout = valerie.knockout || {};

    var extras;

    /**
     * Contains functions that add extra functionality to KnockoutJS.
     * @namespace
     */
    valerie.knockout.extras = extras = valerie.knockout.extras || {};

    /**
     * Creates a binding handler where the <code>update</code> method is only invoked if one of its observable
     * or computed dependencies is updated. Unlike normal bindings, the <code>update</code> method is not invoked if a
     * sibling binding is updated.
     * @memberof valerie.knockout.extras
     * @param {function} initOrUpdateFunction the function to initialise or update the binding
     * @param {function} updateFunction the function to update the binding
     * @returns {{}} an isolated binding handler
     */
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

    /**
     * Creates a Knockout computed whose computation can be paused and resumed.
     * @memberof valerie.knockout.extras
     * @param {function} evaluatorFunction the function to be evaluated as the computed
     * @param {object} [evaluatorFunctionTarget] the object which will act as <code>this</code> when the function is
     * executed
     * @param {object} [options] options to use when creating the computed
     * @param {function} [pausedValueOrObservableOrComputed] a value, observable or computed used to control whether
     * the computed is paused. This parameter could be used to control the state of numerous pausable computeds using
     * a single observable or computed.
     * @returns {function} the computed
     */
    extras.pausableComputed = function (evaluatorFunction, evaluatorFunctionTarget, options,
        pausedValueOrObservableOrComputed) {

        var lastValue,
            paused,
            computed;

        if (pausedValueOrObservableOrComputed == null) {
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

        /**
         * Gets and sets whether the computed is paused.
         */
        computed.paused = ko.computed({
            "read": function () {
                return paused();
            },
            "write": function (value) {
                if (value) {
                    value = true;
                }

                if (value === paused()) {
                    return;
                }

                if (value) {
                    lastValue = computed();
                }

                paused(value);
            }
        });

        /**
         * Refreshes the value of a pausable computed, but leaves the computed's paused state in its original state.
         */
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

// valerie.knockout
// - the class and functions that validate a view-model constructed using knockout observables and computeds

/// <reference path="../dependencies/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.js"/>
/// <reference path="valerie.validationResult.js"/>
/// <reference path="valerie.passThroughConverter.js"/>
/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.formatting.js"/> 
/// <reference path="valerie.extras.js"/>

/*jshint eqnull: true */
/*global ko: false, valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var FailedValidationResult = valerie.FailedValidationResult,
        // ReSharper restore InconsistentNaming
        passedValidationResult = valerie.PassedValidationResult.instance,
        pendingValidationResult = valerie.PendingValidationResult.instance,
        koObservable = ko.observable,
        koComputed = ko.computed,
        utils = valerie.utils,
        formatting = valerie.formatting,
        knockout = valerie.knockout,
        extras = knockout.extras,
        deferEvaluation = { "deferEvaluation": true },
        getValidationStateMethodName = "validation",
        definition;

    // + findValidationStates
    // - finds and returns the validation states of:
    //   - properties for the given model
    //   - sub-models of the given model, if permitted
    //   - descendant properties and sub-models of the given model, if requested
    knockout.findValidationStates = function (model, includeSubModels, recurse, validationStates) {

        if (!(1 in arguments)) {
            includeSubModels = true;
        }

        if (!(2 in arguments)) {
            recurse = false;
        }

        if (!(3 in arguments)) {
            validationStates = [];
        }

        var name,
            validationState,
            value;

        for (name in model) {
            if (model.hasOwnProperty(name)) {
                value = model[name];

                if (value == null) {
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

    // + getValidationState
    // - gets the validation state from a model, observable or computed
    // - for use when developing bindings
    knockout.getValidationState = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return null;
        }

        if (!modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName)) {
            return null;
        }

        return modelOrObservableOrComputed[getValidationStateMethodName]();
    };

    // + hasValidationState
    // - determines if the given model, observable or computed has a validation state
    // - for use when developing bindings
    knockout.hasValidationState = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
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

    // + validate extension function
    // - creates and returns the validation state for an observable or computed
    koObservable.fn.validate = koComputed.fn.validate = function (validationOptions) {

        // Create the validation state, then return it, so it can be modified fluently.
        return knockout.validatableProperty(this, validationOptions);
    };

    // + ModelValidationState
    // - validation state for a model
    // - the model may comprise of simple or complex properties
    (function () {
        // Functions for computeds.
        var failedFunction = function () {
            return this.result().failed;
        },
            failedStatesFunction = function () {
                var failedStates = [],
                    validationStates = this.validationStates(),
                    validationState,
                    result,
                    index;

                for (index = 0; index < validationStates.length; index++) {
                    validationState = validationStates[index];

                    if (validationState.settings.applicable()) {
                        result = validationState.result();

                        if (result.failed) {
                            failedStates.push(validationState);
                        }
                    }
                }

                return failedStates;
            },
            messageFunction = function () {
                return this.result().message;
            },
            passedFunction = function () {
                return this.result().passed;
            },
            pendingFunction = function () {
                return this.result().pending;
            },
            pendingStatesFunction = function () {
                var pendingStates = [],
                    validationStates = this.validationStates(),
                    validationState,
                    index;

                for (index = 0; index < validationStates.length; index++) {
                    validationState = validationStates[index];

                    if (validationState.result().pending) {
                        pendingStates.push(validationState);
                    }
                }

                return pendingStates;
            },
            resultFunction = function () {
                if (this.failedStates().length > 0) {
                    return new FailedValidationResult(this.settings.failureMessageFormat);
                }

                if (this.pendingStates().length > 0) {
                    return pendingValidationResult;
                }

                return passedValidationResult;
            },
            touchedReadFunction = function () {
                var index,
                    validationStates = this.validationStates();

                for (index = 0; index < validationStates.length; index++) {
                    if (validationStates[index].touched()) {
                        return true;
                    }
                }

                return false;
            },
            touchedWriteFunction = function (value) {
                var index,
                    validationStates = this.validationStates();

                for (index = 0; index < validationStates.length; index++) {
                    validationStates[index].touched(value);
                }
            };

        definition = knockout.ModelValidationState = function (model, options) {
            options = utils.mergeOptions(knockout.ModelValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);

            this.model = model;
            this.settings = options;
            this.summary = koObservable([]);
            this.validationStates = ko.observableArray();

            // Computeds.
            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.failedStates = koComputed(failedStatesFunction, this, deferEvaluation);
            this.message = koComputed(messageFunction, this, deferEvaluation);
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.pending = koComputed(pendingFunction, this, deferEvaluation);
            this.pendingStates = koComputed(pendingStatesFunction, this, deferEvaluation);
            this.result = extras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);
            this.touched = koComputed({
                "read": touchedReadFunction,
                "write": touchedWriteFunction,
                "deferEvaluation": true,
                "owner": this
            });

            this.paused = this.result.paused;
            this.refresh = this.result.refresh;
        };

        definition.prototype = {
            // Validation state methods support a fluent interface.
            "addValidationStates": function (validationStates) {
                this.validationStates.push.apply(this.validationStates, validationStates);

                return this;
            },
            "applicable": function (valueOrFunction) {
                if (valueOrFunction == null) {
                    valueOrFunction = true;
                }

                this.settings.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "clearSummary": function (clearSubModelSummaries) {
                var states,
                    state,
                    index;

                this.summary([]);

                if (clearSubModelSummaries) {
                    states = this.validationStates();

                    for (index = 0; index < states.length; index++) {
                        state = states[index];

                        if (state.clearSummary) {
                            state.clearSummary();
                        }
                    }
                }

                return this;
            },
            "name": function (valueOrFunction) {
                this.settings.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "end": function () {
                return this.model;
            },
            "removeValidationStates": function (validationStates) {
                this.validationStates.removeAll(validationStates);

                return this;
            },
            "stopValidatingSubModel": function (validatableSubModel) {
                this.validationStates.removeAll(validatableSubModel.validation().validationStates.peek());

                return this;
            },
            "updateSummary": function (updateSubModelSummaries) {
                var states = this.failedStates(),
                    state,
                    index,
                    failures = [];

                for (index = 0; index < states.length; index++) {
                    state = states[index];

                    failures.push({
                        "name": state.settings.name(),
                        "message": state.message()
                    });
                }

                this.summary(failures);

                if (updateSubModelSummaries) {
                    states = this.validationStates();

                    for (index = 0; index < states.length; index++) {
                        state = states[index];

                        if (state.updateSummary) {
                            state.updateSummary();
                        }
                    }
                }

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

        definition.defaultOptions = {
            "applicable": utils.asFunction(true),
            "failureMessageFormat": "",
            "name": utils.asFunction("(?)"),
            "paused": null
        };
    })();

    // + PropertyValidationState
    // - validation state for a single, simple, observable or computed property
    (function () {
        var missingFunction = function () {
            var value = this.observableOrComputed(),
                missing = this.settings.missingTest(value),
                required = this.settings.required();

            if (missing && required) {
                return -1;
            }

            if (missing && !required) {
                return 0;
            }

            return 1;
        },
            rulesResultFunction = function () {
                var value = this.observableOrComputed(),
                    rules = this.settings.rules,
                    rule,
                    result,
                    index;

                for (index = 0; index < rules.length; index++) {
                    rule = rules[index];

                    result = rule.test(value);

                    if (result.failed || result.pending) {
                        return result;
                    }
                }

                return passedValidationResult;
            },
            // Functions for computeds.
            failedFunction = function () {
                return this.result().failed;
            },
            messageFunction = function () {
                var message = this.result().message;

                message = formatting.replacePlaceholders(message, { "name": this.settings.name() });

                return message;
            },
            passedFunction = function () {
                return this.result().passed;
            },
            pendingFunction = function () {
                return this.result().pending;
            },
            resultFunction = function () {
                var missingResult,
                    result;

                result = this.boundEntry.result();
                if (result.failed) {
                    return result;
                }

                missingResult = missingFunction.apply(this);

                if (missingResult === -1) {
                    return new FailedValidationResult(this.settings.missingFailureMessage);
                }

                if (missingResult === 0) {
                    return result;
                }

                return rulesResultFunction.apply(this);
            },
            showMessageFunction = function () {
                if (!this.settings.applicable()) {
                    return false;
                }

                return this.touched() && this.result().failed;
            };

        // Constructor Function
        definition = knockout.PropertyValidationState = function (observableOrComputed, options) {
            options = utils.mergeOptions(knockout.PropertyValidationState.defaultOptions, options);
            options.applicable = utils.asFunction(options.applicable);
            options.name = utils.asFunction(options.name);
            options.required = utils.asFunction(options.required);

            this.boundEntry = {
                "focused": koObservable(false),
                "result": koObservable(passedValidationResult),
                "textualInput": false
            };

            this.observableOrComputed = observableOrComputed;
            this.settings = options;
            this.touched = koObservable(false);

            // Computeds.
            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.message = extras.pausableComputed(messageFunction, this, deferEvaluation);
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.pending = koComputed(pendingFunction, this, deferEvaluation);
            this.result = koComputed(resultFunction, this, deferEvaluation);
            this.showMessage = extras.pausableComputed(showMessageFunction, this, deferEvaluation);
        };

        definition.prototype = {
            // Validation state methods support a fluent interface.
            "addRule": function (rule) {
                this.settings.rules.push(rule);

                return this;
            },
            "applicable": function (valueOrFunction) {
                if (valueOrFunction == null) {
                    valueOrFunction = true;
                }

                this.settings.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "end": function () {
                var index,
                    settings = this.settings,
                    valueFormat = settings.valueFormat,
                    valueFormatter = settings.converter.formatter,
                    rules = settings.rules,
                    ruleSettings;

                for (index = 0; index < rules.length; index++) {
                    ruleSettings = rules[index].settings;

                    ruleSettings.valueFormat = valueFormat;
                    ruleSettings.valueFormatter = valueFormatter;
                }

                return this.observableOrComputed;
            },
            "name": function (valueOrFunction) {
                this.settings.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "required": function (valueOrFunction) {
                if (valueOrFunction == null) {
                    valueOrFunction = true;
                }

                this.settings.required = utils.asFunction(valueOrFunction);

                return this;
            },
            "valueFormat": function (format) {
                this.settings.valueFormat = format;

                return this;
            }
        };

        // Define default options.
        definition.defaultOptions = {
            "applicable": utils.asFunction(true),
            "converter": valerie.converters.passThrough,
            "entryFormat": null,
            "invalidEntryFailureMessage": "",
            "missingFailureMessage": "",
            "missingTest": utils.isMissing,
            "name": utils.asFunction(),
            "required": utils.asFunction(false),
            "rules": [],
            "valueFormat": null
        };
    })();
})();

// valerie.knockout.bindings
// - knockout bindings for:
//   - validating user entries
//   - showing the validation state of a view-model

/// <reference path="../dependencies/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.js"/>
/// <reference path="valerie.validationResult.js"/>
/// <reference path="valerie.utils.js"/>
/// <reference path="valerie.dom.js"/>
/// <reference path="valerie.knockout.extras.js"/>
/// <reference path="valerie.knockout.js"/>
/// <reference path="valerie.passThrough.js"/>

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var FailedValidationResult = valerie.FailedValidationResult,
        // ReSharper restore InconsistentNaming
        passedValidationResult = valerie.PassedValidationResult.instance,
        utils = valerie.utils,
        dom = valerie.dom,
        knockout = valerie.knockout,
        converters = valerie.converters,
        koBindingHandlers = ko.bindingHandlers,
        koRegisterEventHandler = ko.utils.registerEventHandler,
        setElementVisibility = dom.setElementVisibility,
        getValidationState = knockout.getValidationState,
        isolatedBindingHandler = valerie.knockout.extras.isolatedBindingHandler;

    // Define validatedChecked and validatedValue binding handlers.
    (function () {
        var checkedBindingHandler = koBindingHandlers.checked,
            valueBindingHandler = koBindingHandlers.value,
            validatedCheckedBindingHandler,
            validatedValueBindingHandler,
            blurHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed);

                validationState.touched(true);
                validationState.boundEntry.focused(false);
                validationState.message.paused(false);
                validationState.showMessage.paused(false);
            },
            textualInputBlurHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed),
                    value;

                if (validationState.boundEntry.result.peek().failed) {
                    return;
                }

                value = observableOrComputed.peek();
                element.value = validationState.settings.converter.formatter(value,
                    validationState.settings.entryFormat);
            },
            textualInputFocusHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed);

                validationState.boundEntry.focused(true);
                validationState.message.paused(true);
                validationState.showMessage.paused(true);
            },
            textualInputKeyUpHandler = function (element, observableOrComputed) {
                var enteredValue = ko.utils.stringTrim(element.value),
                    parsedValue,
                    validationState = getValidationState(observableOrComputed),
                    settings = validationState.settings,
                    result = passedValidationResult;

                if (enteredValue.length === 0) {
                    observableOrComputed(null);

                    if (settings.required()) {
                        result = new FailedValidationResult(settings.missingFailureMessage);
                    }
                } else {
                    parsedValue = settings.converter.parser(enteredValue);
                    observableOrComputed(parsedValue);

                    if (parsedValue == null) {
                        result = new FailedValidationResult(settings.invalidEntryFailureMessage);
                    }
                }

                validationState.boundEntry.result(result);
            },
            textualInputUpdateFunction = function (observableOrComputed, validationState, element) {
                // Get the value so this function becomes dependent on the observable or computed.
                var value = observableOrComputed();

                // Prevent a focused element from being updated by the model.
                if (validationState.boundEntry.focused.peek()) {
                    return;
                }

                validationState.boundEntry.result(passedValidationResult);

                element.value = validationState.settings.converter.formatter(value,
                    validationState.settings.entryFormat);
            };

        // + validatedChecked binding handler
        // - functions in the same way as the "checked" binding handler
        // - registers a blur event handler so validation messages for missing selections can be displayed
        validatedCheckedBindingHandler = koBindingHandlers.validatedChecked = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = getValidationState(observableOrComputed);

                checkedBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);

                if (validationState) {
                    koRegisterEventHandler(element, "blur", function () {
                        blurHandler(element, observableOrComputed);
                    });

                    // Use the name of the bound element if a property name has not been specified.
                    if (validationState.settings.name() == null) {
                        validationState.settings.name = utils.asFunction(element.name);
                    }
                }
            },
            "update": checkedBindingHandler.update
        };

        // + validatedValue binding handler
        // - with the exception of textual inputs, functions in the same way as the "value" binding handler
        // - registers a blur event handler so validation messages for completed entries or selections can be displayed
        // - registers a blur event handler to reformat parsed textual entries
        validatedValueBindingHandler = koBindingHandlers.validatedValue = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = getValidationState(observableOrComputed),
                    tagName,
                    textualInput;

                if (!validationState) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                if (validationState.settings.name() == null) {
                    validationState.settings.name = utils.asFunction(element.name);
                }

                koRegisterEventHandler(element, "blur", function () {
                    blurHandler(element, observableOrComputed);
                });

                tagName = ko.utils.tagNameLower(element),
                textualInput = (tagName === "input" && element.type.toLowerCase() === "text") || tagName === "textarea";

                if (!textualInput) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                validationState.boundEntry.textualInput = true;

                koRegisterEventHandler(element, "blur", function () {
                    textualInputBlurHandler(element, observableOrComputed);
                });

                koRegisterEventHandler(element, "focus", function () {
                    textualInputFocusHandler(element, observableOrComputed);
                });

                koRegisterEventHandler(element, "keyup", function () {
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
                    validationState = getValidationState(observableOrComputed);

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
            koBindingHandlers.checked = validatedCheckedBindingHandler;
            koBindingHandlers.value = validatedValueBindingHandler;
            koBindingHandlers.koChecked = checkedBindingHandler;
            koBindingHandlers.koValue = valueBindingHandler;

            // Allow configuration changes to be made fluently.
            return knockout;
        };

        // + useOriginalBindingHandlers
        // - restores the original "checked" and "value" binding handlers
        knockout.useOriginalBindingHandlers = function () {
            koBindingHandlers.checked = checkedBindingHandler;
            koBindingHandlers.value = valueBindingHandler;

            // Allow configuration changes to be made fluently.
            return knockout;
        };
    })();

    (function () {
        var applyForValidationState =
            function (functionToApply, element, valueAccessor, allBindingsAccessor, viewModel) {
                var bindings = allBindingsAccessor(),
                    value = valueAccessor(),
                    validationState;

                if (value === true) {
                    value = bindings.value || bindings.checked ||
                        bindings.validatedValue || bindings.validatedChecked ||
                        viewModel;
                }

                validationState = getValidationState(value);

                if (validationState) {
                    functionToApply(validationState, value, bindings);
                }
            };

        // + disabledWhenNotValid binding handler
        koBindingHandlers.disabledWhenNotValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.passed();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + disabledWhenTouchedAndNotValid binding handler
        koBindingHandlers.disabledWhenTouchedAndNotValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = validationState.touched() && !validationState.passed();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + enabledWhenApplicable binding handler
        koBindingHandlers.enabledWhenApplicable = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.settings.applicable();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + formattedValue binding handler
        koBindingHandlers.formattedValue = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor) {
                var bindings = allBindingsAccessor(),
                    observableOrComputedOrValue = valueAccessor(),
                    value = ko.utils.unwrapObservable(observableOrComputedOrValue),
                    validationState = getValidationState(observableOrComputedOrValue),
                    formatter = converters.passThrough.formatter,
                    valueFormat;

                if (validationState) {
                    formatter = validationState.settings.converter.formatter;
                    valueFormat = validationState.settings.valueFormat;
                }

                formatter = bindings.formatter || formatter;
                if (valueFormat == null) {
                    valueFormat = bindings.valueFormat;
                }

                ko.utils.setTextContent(element, formatter(value, valueFormat));
            });

        // + validationCss binding handler
        // - sets CSS classes on the bound element depending on the validation status of the value:
        //   - error: if validation failed
        //   - focused: if the bound element is in focus
        //   - passed: if validation passed
        //   - touched: if the bound element has been touched
        //   - untouched: if the bound element has not been touched
        // - the names of the classes used are held in the bindingHandlers.validationCss.classNames object
        koBindingHandlers.validationCss = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    var classNames = koBindingHandlers.validationCss.classNames,
                        elementClassNames = element.className,
                        dictionary = dom.classNamesStringToDictionary(elementClassNames),
                        failed = validationState.failed(),
                        focused = false,
                        passed = validationState.passed(),
                        pending = validationState.pending(),
                        touched = validationState.touched(),
                        untouched = !touched;

                    if (validationState.boundEntry && validationState.boundEntry.focused()) {
                        focused = true;
                    }

                    dictionary[classNames.failed] = failed;
                    dictionary[classNames.focused] = focused;
                    dictionary[classNames.passed] = passed;
                    dictionary[classNames.pending] = pending;
                    dictionary[classNames.touched] = touched;
                    dictionary[classNames.untouched] = untouched;

                    element.className = dom.classNamesDictionaryToString(dictionary);
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        koBindingHandlers.validationCss.classNames = {
            "failed": "error",
            "focused": "focused",
            "passed": "success",
            "pending": "waiting",
            "touched": "touched",
            "untouched": "untouched"
        };

        // + validationMessageFor binding handler
        // - makes the bound element visible if the value is invalid
        // - sets the text of the bound element to be the validation message
        koBindingHandlers.validationMessageFor = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.showMessage());
                    ko.utils.setTextContent(element, validationState.message());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenFocused binding handler
        // - makes the bound element visible if the bound element for the value is focused, invisible otherwise
        koBindingHandlers.visibleWhenFocused = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.focused());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenInvalid binding handler
        // - makes the bound element visible if the value is invalid, invisible otherwise
        koBindingHandlers.visibleWhenInvalid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.failed());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenSummaryNotEmpty binding handler
        // - makes the bound element visible if the validation summary is not empty, invisible otherwise
        koBindingHandlers.visibleWhenSummaryNotEmpty = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.summary().length > 0);
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenTouched binding handler
        // - makes the bound element visible if the value has been touched, invisible otherwise
        koBindingHandlers.visibleWhenTouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenUntouched binding handler
        // - makes the bound element visible if the value is untouched, invisible otherwise
        koBindingHandlers.visibleWhenUntouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, !validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenValid binding handler
        // - makes the bound element visible if the value is valid, invisible otherwise
        koBindingHandlers.visibleWhenValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.passed());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });
    })();
})();
