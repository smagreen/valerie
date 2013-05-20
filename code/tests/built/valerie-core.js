/**
 * The top-level valerie namespace.
 * @namespace valerie
 */
var valerie = {};

(function () {
    "use strict";

    /**
     * Contains general purpose utilities.
     * @namespace valerie.utils
     */
    valerie.utils = {};

    // Shortcuts.
    var utils = valerie.utils;

    /**
     * Creates a function that returns the given value, or simply returns the given value if it is already a function.
     * @memberof valerie.utils
     * @param {*|function} [valueOrFunction] the value or function
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
        //noinspection JSValidateTypes
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

        return value.length === 0;
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
        //noinspection JSValidateTypes
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
     */
    valerie.formatting = {};

    // Shortcuts.
    var formatting = valerie.formatting;

    /**
     * Adds thousands separators to the given number string.
     * @memberof valerie.formatting
     * @param {string} numberString a string representation of a number
     * @param {char|string} thousandsSeparator the character to use to separate the thousands
     * @param {char|string} decimalSeparator the character used to separate the whole part of the number from its
     * fractional part
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

    /**
     * Contains utilities for working with the HTML document object model.
     * @namespace
     * @inner
     */
    valerie.dom = {};

    var classNamesSeparatorExpression = /\s+/g,
        trimWhitespaceExpression = /^\s+|\s+$/g,
    // Shortcuts.
        dom = valerie.dom;

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

    /**
     * Contains functions that add extra functionality to KnockoutJS.
     * @namespace
     */
    valerie.koExtras = {};

    /**
     * Creates a binding handler where the <code>update</code> method is only invoked if one of its observable
     * or computed dependencies is updated. Unlike normal bindings, the <code>update</code> method is not invoked if a
     * sibling binding is updated.
     * @memberof valerie.koExtras
     * @param {function} initOrUpdateFunction the function to initialise or update the binding
     * @param {function} updateFunction the function to update the binding
     * @return {{}} an isolated binding handler
     */
    valerie.koExtras.isolatedBindingHandler = function (initOrUpdateFunction, updateFunction) {
        var initFunction = (arguments.length === 1) ? function () {
        } : initOrUpdateFunction;

        updateFunction = (arguments.length === 2) ? updateFunction : initOrUpdateFunction;

        return {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                initFunction(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

                //noinspection JSCheckFunctionSignatures
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
     * @memberof valerie.koExtras
     * @param {function} evaluatorFunction the function to be evaluated as the computed
     * @param {object} [evaluatorFunctionTarget] the object which will act as <code>this</code> when the function is
     * executed
     * @param {object} [options] options to use when creating the computed
     * @param {function} [pausedValueOrObservableOrComputed] a value, observable or computed used to control whether
     * the computed is paused. This parameter could be used to control the state of numerous pausable computeds using
     * a single observable or computed.
     * @return {function} the computed
     */
    valerie.koExtras.pausableComputed = function (evaluatorFunction, evaluatorFunctionTarget, options,
        pausedValueOrObservableOrComputed) {

        var lastValue,
            paused,
            computed;

        if (pausedValueOrObservableOrComputed == null) {
            //noinspection JSCheckFunctionSignatures
            paused = ko.observable(false);
        } else {
            //noinspection JSCheckFunctionSignatures
            paused = ko.utils.isSubscribable(pausedValueOrObservableOrComputed) ?
                pausedValueOrObservableOrComputed :
                ko.observable(pausedValueOrObservableOrComputed);
        }

        //noinspection JSCheckFunctionSignatures
        computed = ko.computed(function () {
            if (paused()) {
                return lastValue;
            }

            return evaluatorFunction.call(evaluatorFunctionTarget);
        }, evaluatorFunctionTarget, options);

        //noinspection JSCheckFunctionSignatures
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

(function () {
    "use strict";

    /**
     * Contains converters, always singletons.
     * @namespace
     * @see valerie.IConverter
     */
    valerie.converters = {};

    /**
     * A converter which formats and parses strings.
     * Used as the default converter in numerous places throughout the library.
     * @name valerie.converters~passThrough
     * @type valerie.IConverter
     */
    valerie.converters.passThrough = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parse": function (value) {
            return value;
        }
    };
})();

(function () {
    "use strict";

    var states = {
        "failed": {},
        "passed": {},
        "pending": {}
    };

    /**
     * Constructs the result of a validation activity.
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
        if (message == null) {
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
    valerie.ValidationResult.states = states;

    /**
     * A validation result for when validation has passed.
     * @type {valerie.ValidationResult}
     */
    valerie.ValidationResult.passedInstance = new valerie.ValidationResult(states.passed);

    /**
     * A validation result for when validation hasn't yet completed.
     * @type {valerie.ValidationResult}
     */
    valerie.ValidationResult.pendingInstance = new valerie.ValidationResult(states.pending);

    /**
     * Creates a validation result for when validation has failed.
     * @param {string} [message] a message from the activity
     * @return {valerie.ValidationResult}
     */
    valerie.ValidationResult.createFailedResult = function (message) {
        return new valerie.ValidationResult(states.failed, message);
    };
})();

(function () {
    "use strict";

    /**
     * Contains utilities for working with validation states.
     * @namespace
     */
    valerie.validationState = {};

    var getValidationStateMethodName = "validation",
        utils = valerie.utils;

    /**
     * Finds and returns the validation states of:
     * <ul>
     *     <li>immediate properties of the given model</li>
     *     <li>immediate sub-models of the given model, if specified</li>
     *     <li>descendant properties of the given model, if specified</li>
     *     <li>descendant sub-models of the given model, if specified</li>
     * </ul>
     * @param {object} model the model to find validation states in
     * @param {boolean} [includeSubModels = true] whether to return the validation states of child
     * sub-models
     * @param {boolean} [recurse = false] whether to inspect the descendant properties and, if specified,
     * descendant sub-models of child sub-models
     * @param {array.<valerie.IValidationState>} [validationStates] the already inspected validation states; this
     * parameter is used in recursive invocations
     */
    valerie.validationState.findIn = function (model, includeSubModels, recurse, validationStates) {
        if (!(1 in arguments)) {
            includeSubModels = true;
        }

        if (!(2 in arguments)) {
            recurse = false;
        }

        if (!(3 in arguments)) {
            //noinspection JSValidateTypes
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

                validationState = valerie.validationState.getFor(value);

                if (ko.isObservable(value)) {
                    value = value.peek();
                }

                if (utils.isFunction(value)) {
                    continue;
                }

                if (utils.isArrayOrObject(value)) {
                    if (includeSubModels && validationState) {
                        //noinspection JSUnresolvedFunction
                        validationStates.push(validationState);
                    }

                    if (recurse) {
                        //noinspection JSValidateTypes
                        valerie.validationState.findIn(value, includeSubModels, true, validationStates);
                    }
                } else {
                    if (validationState) {
                        //noinspection JSUnresolvedFunction
                        validationStates.push(validationState);
                    }
                }
            }
        }

        return validationStates;
    };

    /**
     * Gets the validation state for the given model, observable or computed.<br>
     * If the model is known to have a validation state, the construct <code>model.validation()</code> can also be used
     * retrieve it.<br/>
     * <i>This function is useful when developing binding handlers.</i>
     * @param {object|function} modelOrObservableOrComputed the thing to get the validation state for
     * @return {null|valerie.IValidationState} the validation state or <code>null</code> if the given thing does not
     * have a validation state.
     */
    valerie.validationState.getFor = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return null;
        }

        if (!modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName)) {
            return null;
        }

        return modelOrObservableOrComputed[getValidationStateMethodName]();
    };

    /**
     * Informs if the given model, observable or computed has a validation state.<br/>
     * <i>This function is useful when developing binding handlers.</i>
     * @param {object|function} modelOrObservableOrComputed the thing to test
     * @return {boolean} whether the given thing has a validation state
     */
    valerie.validationState.has = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return false;
        }

        return modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName);
    };

    /**
     * Sets the validation state for the given model, observable or computed.
     * @param {object|function} modelOrObservableOrComputed the thing to set the validation state on
     * @param {valerie.IValidationState} state the validation state to use
     */
    valerie.validationState.setFor = function (modelOrObservableOrComputed, state) {
        modelOrObservableOrComputed[getValidationStateMethodName] = function () {
            return state;
        };
    };
})();

(function () {
    "use strict";
    var deferEvaluation = { "deferEvaluation": true },
    // Shortcuts.
        utils = valerie.utils,
        passedValidationResult = valerie.ValidationResult.passedInstance,
        pendingValidationResult = valerie.ValidationResult.pendingInstance,
        koObservable = ko.observable,
        koComputed = ko.computed,

    // Functions for computeds.
        failedFunction = function () {
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

                if (validationState.isApplicable()) {
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

                if (validationState.isApplicable() && validationState.result().pending) {
                    pendingStates.push(validationState);
                }
            }

            return pendingStates;
        },
        resultFunction = function () {
            if (this.failedStates().length > 0) {
                return valerie.ValidationResult.createFailedResult(this.settings.failureMessageFormat);
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

    /**
     * An item in a model validation state summary.
     * @typedef {object} valerie.ModelValidationState.summaryItem
     * @property {string} name the name of the property or sub-model which has failed validation
     * @property {string} message a message describing why validation failed
     */

    /**
     * Construction options for a model validation state.
     * @typedef {object} valerie.ModelValidationState.options
     * @property {function} applicable the function used to determine if the model is applicable
     * @property {string} failureMessage the message shown when the model is in an invalid state
     * @property {function} name the function used to determine the name of the model; used in failure messages
     * @property {function} paused a value, observable or computed used to control whether the computation that updates
     * the result of this validation state is paused.
     */

    /**
     * Constructs the validation state for a model, which may comprise of simple properties and sub-models.
     * @param model the model the validation state is for
     * @param {valerie.ModelValidationState.options} [options = default options] the options to use when creating the
     * validation state
     * @constructor
     */
    valerie.ModelValidationState = function (model, options) {
        //noinspection JSValidateTypes
        options = utils.mergeOptions(valerie.ModelValidationState.defaultOptions, options);
        //noinspection JSUnresolvedVariable,JSUndefinedPropertyAssignment
        options.applicable = utils.asFunction(options.applicable);
        //noinspection JSUnresolvedVariable,JSUndefinedPropertyAssignment
        options.name = utils.asFunction(options.name);

        /**
         * Gets whether the model has failed validation.
         * @method
         * @return {boolean} <code>true</code> if validation has failed, <code>false</code> otherwise
         */
        this.failed = koComputed(failedFunction, this, deferEvaluation);

        /**
         * Gets the validation states that belong to the model that are in a failure state.
         * @method
         * @return {array.<valerie.IValidationState>} the states that are in failure state
         */
        this.failedStates = koComputed(failedStatesFunction, this, deferEvaluation);

        /**
         * Gets a message describing the validation state.
         * @method
         * @return {string} the message, can be empty
         */
        this.message = koComputed(messageFunction, this, deferEvaluation);

        /**
         * The model this validation state is for.
         * @type {*}
         */
        this.model = model;

        /**
         * Gets whether the model has passed validation.
         * @method
         * @return {boolean} <code>true</code> if validation has passed, <code>false</code> otherwise
         */
        this.passed = koComputed(passedFunction, this, deferEvaluation);

        /**
         * Gets whether validation for the model is pending.
         * @method
         * @return {boolean} <code>true</code> is validation is pending, <code>false</code> otherwise
         */
        this.pending = koComputed(pendingFunction, this, deferEvaluation);

        /**
         * Gets the validation states that belong to the model that are in a pending state.
         * @method
         * @return {array.<valerie.IValidationState>} the states that are in pending state
         */
        this.pendingStates = koComputed(pendingStatesFunction, this, deferEvaluation);

        //noinspection JSUnresolvedVariable
        /**
         * Gets the result of the validation.
         * @method
         * @return {valerie.ValidationResult} the result
         */
        this.result = valerie.koExtras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);

        /**
         * Gets or sets whether the computation that updates the validation result has been paused.
         * @method
         * @param {boolean} [value] <code>true</code> if the computation should be paused, <code>false</code> if the
         * computation should not be paused
         * @return {boolean} <code>true</code> if the computation is paused, <code>false</code> otherwise
         */
        this.paused = this.result.paused;

        /**
         * Refreshes the validation result.
         * @method
         */
        this.refresh = this.result.refresh;

        /**
         * The settings for this validation state.
         * @type {valerie.PropertyValidationState.options}
         */
        this.settings = options;

        /**
         * Gets the name of the model.
         * @method
         * @return {string} the name of the model
         */
        this.getName = this.settings.name;

        /**
         * Gets whether the model is applicable.
         * @method
         * @return {boolean} <code>true</code> if the model is applicable, <code>false</code> otherwise
         */
        this.isApplicable = this.settings.applicable;

        //noinspection JSValidateJSDoc
        /**
         * Gets a static summary of the validation states are in a failure state.
         * @method
         * @return {array.<valerie.ModelValidationState.summaryItem>} the summary
         */
        this.summary = koObservable([]);

        /**
         * Gets or sets whether the model has been "touched" by a user action.
         * @method
         * @param {boolean} [value] <code>true</code> if the model should marked as touched, <code>false</code> if
         * the model should be marked as untouched
         * @return {boolean} <code>true</code> if the model has been "touched", <code>false</code> otherwise
         */
        this.touched = koComputed({
            "read": touchedReadFunction,
            "write": touchedWriteFunction,
            "deferEvaluation": true,
            "owner": this
        });

        /**
         * Gets the validation states that belong to this model.
         * @method
         * @return {array.<valerie.IValidationState>} the validation states
         */
        this.validationStates = ko.observableArray();
    };

    valerie.ModelValidationState.prototype = {
        /**
         * Adds validation states to this validation state.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#addValidationStates
         * @fluent
         * @param {array.<valerie.IValidationState>} validationStates the validation states to add
         * @return {valerie.ModelValidationState}
         */
        "addValidationStates": function (validationStates) {
            //noinspection JSValidateTypes
            this.validationStates.push.apply(this.validationStates, validationStates);

            return this;
        },
        /**
         * Sets the value or function used to determine if the model is applicable.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#applicable
         * @fluent
         * @param {boolean|function} [valueOrFunction = true] the value or function to use
         * @return {valerie.ModelValidationState}
         */
        "applicable": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.applicable = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Clears the static summary of validation states that are in a failure state.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#clearSummary
         * @fluent
         * @param {boolean} [clearSubModelSummaries = false] whether to clear the static summaries for sub-models
         * @return {valerie.ModelValidationState}
         */
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
        /**
         * Ends a chain of fluent method calls on this model validation state.
         * @return {function} the model the validation state is for
         */
        "end": function () {
            return this.model;
        },
        /**
         * Sets the value or function used to determine the name of the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string|function} valueOrFunction the value or function to use
         * @return {valerie.ModelValidationState}
         */
        "name": function (valueOrFunction) {
            this.settings.name = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Removes validation states.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {array.<valerie.IValidationState>} validationStates the validation states to remove
         * @return {valerie.ModelValidationState}
         */
        "removeValidationStates": function (validationStates) {
            this.validationStates.removeAll(validationStates);

            return this;
        },
        /**
         * Stops validating the given sub-model by removing the validation states that belong to it.
         * @param {*} validatableSubModel the sub-model to stop validating
         * @return {valerie.ModelValidationState}
         */
        "stopValidatingSubModel": function (validatableSubModel) {
            this.validationStates.removeAll(validatableSubModel.validation().validationStates.peek());

            return this;
        },
        /**
         * Updates the static summary of validation states that are in a failure state.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean} [updateSubModelSummaries = false] whether to update the static summaries for sub-models
         * @return {valerie.ModelValidationState}
         */
        "updateSummary": function (updateSubModelSummaries) {
            var states = this.failedStates(),
                state,
                index,
                failures = [];

            for (index = 0; index < states.length; index++) {
                state = states[index];

                failures.push({
                    "name": state.getName(),
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
        /**
         * Adds the validation states for all the descendant properties and sub-models that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateAll": function () {
            var validationStates = valerie.validationState.findIn(this.model, true, true);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the descendant properties that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateAllProperties": function () {
            var validationStates = valerie.validationState.findIn(this.model, false, true);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the child properties that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateChildProperties": function () {
            var validationStates = valerie.validationState.findIn(this.model, false, false);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the child properties and sub-models that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateChildPropertiesAndSubModels": function () {
            var validationStates = valerie.validationState.findIn(this.model, true, false);
            this.addValidationStates(validationStates);

            return this;
        }
    };

    /**
     * The default options used when constructing a model validation state.
     * @name valerie.ModelValidationState.defaultOptions
     * @lends valerie.ModelValidationState.options
     */
    valerie.ModelValidationState.defaultOptions = {
        "applicable": utils.asFunction(true),
        "failureMessageFormat": "",
        "name": utils.asFunction("(?)"),
        "paused": null
    };

    /**
     * Makes the passed-in model validatable. After invocation the model will have a validation state.
     * <br/><b>fluent</b>
     * @param {object|function} model the model to make validatable
     * @param {valerie.ModelValidationState.options} [options] the options to use when creating the model's validation
     * state
     * @return {valerie.ModelValidationState} the validation state belonging to the model
     */
    valerie.validatableModel = function (model, options) {
        var validationState = new valerie.ModelValidationState(model, options);

        valerie.validationState.setFor(model, validationState);

        return validationState;
    };
})();

(function () {
    "use strict";

    var deferEvaluation = { "deferEvaluation": true },
    // Shortcuts.
        utils = valerie.utils,
        formatting = valerie.formatting,
        koExtras = valerie.koExtras,
        koObservable = ko.observable,
        koComputed = ko.computed,
        passedValidationResult = valerie.ValidationResult.passedInstance,

    // Functions used by computeds.
        missingFunction = function (validationState) {
            var value = validationState.observableOrComputed(),
                missing = validationState.settings.missingTest(value),
                required = validationState.settings.required();

            if (missing && required) {
                return -1;
            }

            if (missing && !required) {
                return 0;
            }

            return 1;
        },
        rulesResultFunction = function (validationState) {
            var value = validationState.observableOrComputed(),
                rules = validationState.settings.rules,
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

            missingResult = missingFunction(this);

            if (missingResult === -1) {
                return valerie.ValidationResult.createFailedResult(this.settings.missingFailureMessage);
            }

            if (missingResult === 0) {
                return result;
            }


            return rulesResultFunction(this);
        },
        showMessageFunction = function () {
            if (!this.settings.applicable()) {
                return false;
            }

            return this.touched() && this.result().failed;
        };

    /**
     * Construction options for a property validation state.
     * @typedef {object} valerie.PropertyValidationState.options
     * @property {function} applicable the function used to determine if the property is applicable
     * @property {valerie.IConverter} converter the converter used to parse user
     * entries and format display of the property's value
     * @property {string} entryFormat the string used to format the property's value for display in a user entry
     * @property {string} invalidFailureMessage the message shown when the user has entered an invalid value
     * @property {string} missingFailureMessage the message shown when a value is required but is missing
     * @property {function} name the function used to determine the name of the property; used in failure messages
     * @property {function} required the function used to determine if a value is required
     * @property {valerie.array<IRule>} rules the chain of rules used to validate the property's value
     * @property {string} valueFormat the string use to format the property's value for display in a message
     */

    /**
     * Constructs the validation state for a simple, single, observable or computed property.
     * @constructor
     * @param {function} observableOrComputed the observable or computed the validation state is for
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to use when creating the
     * validation state
     */
    valerie.PropertyValidationState = function (observableOrComputed, options) {
        //noinspection JSValidateTypes
        options = utils.mergeOptions(valerie.PropertyValidationState.defaultOptions, options);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.applicable = utils.asFunction(options.applicable);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.name = utils.asFunction(options.name);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.required = utils.asFunction(options.required);

        // Available, but not for "consumer" use.
        this.boundEntry = {
            "focused": koObservable(false),
            "result": koObservable(passedValidationResult),
            "textualInput": false
        };

        /**
         * Gets whether the value held by or entered for the property fails validation.
         * @method
         * @return {boolean} <code>true</code> if validation has failed, <code>false</code> otherwise
         */
        this.failed = koComputed(failedFunction, this, deferEvaluation);

        /**
         * Gets a message describing the validation state.
         * @method
         * @return {string} the message, can be empty
         */
        this.message = koExtras.pausableComputed(messageFunction, this, deferEvaluation);

        /**
         * Gets whether the value held by or entered for the property passes validation.
         * @method
         * @return {boolean} <code>true</code> if validation has passed, <code>false</code> otherwise
         */
        this.passed = koComputed(passedFunction, this, deferEvaluation);

        /**
         * The observable or computed this validation state is for.
         * @type {function}
         */
        this.observableOrComputed = observableOrComputed;

        /**
         * Gets whether validation for the property hasn't yet completed.
         * @method
         * @return {boolean} <code>true</code> is validation is pending, <code>false</code> otherwise
         */
        this.pending = koComputed(pendingFunction, this, deferEvaluation);

        /**
         * Gets the result of the validation.
         * @method
         * @return {valerie.ValidationResult} the result
         */
        this.result = koComputed(resultFunction, this, deferEvaluation);

        /**
         * The settings for this validation state.
         * @type {valerie.PropertyValidationState.options}
         */
        this.settings = options;

        /**
         * Gets the name of the property.
         * @method
         * @return {string} the name of the property
         */
        this.getName = this.settings.name;

        /**
         * Gets whether the property is applicable.
         * @method
         * @return {boolean} <code>true</code> if the property is applicable, <code>false</code> otherwise
         */
        this.isApplicable = this.settings.applicable;

        /**
         * Gets whether the message describing the validation state should be shown.
         * @method
         * @return {boolean} <code>true</code> if the message should be shown, <code>false</code> otherwise
         */
        this.showMessage = koExtras.pausableComputed(showMessageFunction, this, deferEvaluation);

        /**
         * Gets or sets whether the property has been "touched" by a user action.
         * @method
         * @param {boolean} [value] <code>true</code> if the property should marked as touched, <code>false</code> if
         * the property should be marked as untouched
         * @return {boolean} <code>true</code> if the property has been "touched", <code>false</code> otherwise
         */
        this.touched = koObservable(false);
    };

    valerie.PropertyValidationState.prototype = {
        /**
         * Adds a rule to the chain of rules used to validate the property's value.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {valerie.IRule} rule the rule to add
         * @return {valerie.PropertyValidationState}
         */
        "addRule": function (rule) {
            this.settings.rules.push(rule);

            return this;
        },
        /**
         * Sets the value or function used to determine if the property is applicable.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean|function} [valueOrFunction = true] the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "applicable": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.applicable = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Ends a chain of fluent method calls on this property validation state.<br/>
         * Applies the <b>options.valueFormat</b> format string to all the rules in the rule chain.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {function} the observable or computed the validation state is for
         */
        "end": function () {
            var index,
                settings = this.settings,
                valueFormat = settings.valueFormat,
                rules = settings.rules,
                ruleSettings;

            for (index = 0; index < rules.length; index++) {
                ruleSettings = rules[index].settings;

                ruleSettings.valueFormat = valueFormat;
            }

            return this.observableOrComputed;
        },
        /**
         * Sets the format string used to format the display of the value in an entry.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string} format the format string to use
         * @return {valerie.PropertyValidationState}
         */
        "entryFormat": function (format) {
            this.settings.entryFormat = format;

            return this;
        },
        /**
         * Sets the value or function used to determine the name of the property.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string|function} valueOrFunction the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "name": function (valueOrFunction) {
            this.settings.name = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Sets the value or function used to determine the if the property is required.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean|function} [valueOrFunction = false] the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "required": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.required = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Sets the format string used to format the display of the value.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string} format the format string to use
         * @return {valerie.PropertyValidationState}
         */
        "valueFormat": function (format) {
            this.settings.valueFormat = format;

            return this;
        }
    };

    /**
     * The default options used when constructing a property validation state.
     * @name valerie.PropertyValidationState.defaultOptions
     * @lends valerie.PropertyValidationState.options
     */
    valerie.PropertyValidationState.defaultOptions = {
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

    /**
     * Makes the passed-in property validatable. After invocation the property will have a validation state.
     * <br/><b>fluent</b>
     * @param {function} observableOrComputed the Knockout observable or computed to make validatable
     * @param {valerie.PropertyValidationState.options} [options] the options to use when creating the property's
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the property
     * @throws {string} Only observables or computeds can be made validatable properties.
     */
    valerie.validatableProperty = function (observableOrComputed, options) {
        if (!ko.isSubscribable(observableOrComputed)) {
            throw "Only observables or computeds can be made validatable properties.";
        }

        var validationState = new valerie.PropertyValidationState(observableOrComputed, options);

        valerie.validationState.setFor(observableOrComputed, validationState);

        return validationState;
    };
})();

(function () {
    "use strict";

    /**
     * Creates and sets a validation state on a Knockout computed.<br/>
     * <i>[fluent]</i>
     * @name ko.computed#validate
     * @method
     * @fluent
     * @param {valerie.PropertyValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the computed
     */
    ko.computed.fn.validate = function(validationOptions) {
        return valerie.validatableProperty(this, validationOptions);
    };
})();

(function () {
    "use strict";

    /**
     * Creates and sets a validation state on a Knockout observable.<br/>
     * <i>[fluent]</i>
     * @name ko.observable#validate
     * @method
     * @fluent
     * @param {valerie.PropertyValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the observable
     */
    ko.observable.fn.validate = function(validationOptions) {
        return valerie.validatableProperty(this, validationOptions);
    };
})();

(function () {
    "use strict";

    // Shortcuts.
    var passedValidationResult = valerie.ValidationResult.passedInstance,
        utils = valerie.utils,
        dom = valerie.dom,
        setElementVisibility = dom.setElementVisibility,
        converters = valerie.converters,
        getValidationState = valerie.validationState.getFor,
        koBindingHandlers = ko.bindingHandlers,
        koRegisterEventHandler = ko.utils.registerEventHandler,
        isolatedBindingHandler = valerie.koExtras.isolatedBindingHandler;

    // Define validatedChecked and validatedValue binding handlers.
    (function () {
        var checkedBindingHandler = koBindingHandlers.checked,
            valueBindingHandler = koBindingHandlers.value,
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
                element.value = validationState.settings.converter.format(value,
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
                        result = valerie.ValidationResult.createFailedResult(settings.missingFailureMessage);
                    }
                } else {
                    parsedValue = settings.converter.parse(enteredValue);
                    observableOrComputed(parsedValue);

                    if (parsedValue == null) {
                        result = valerie.ValidationResult.createFailedResult(settings.invalidEntryFailureMessage);
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

                element.value = validationState.settings.converter.format(value,
                    validationState.settings.entryFormat);
            };

        /**
         * Validates entries that can be checked, i.e. check boxes and radio buttons.
         * Functions in the same way as the <b>ko.bindingHandlers.checked</b> binding handler, with the following
         * alterations:
         * <ul>
         *     <li>registers a blur event handler so validation messages for missing selections can be displayed</li>
         * </ul>
         * @name ko.bindingHandlers.validatedValue
         */
        koBindingHandlers.validatedChecked = {
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

        /**
         * Validates entries that can be keyed or selected.
         * Functions in the same way as the <b>ko.bindingHandlers.value</b> binding handler, with the following
         * alterations:
         * <ul>
         *     <li>registers a blur event handler:
         *     <ul>
         *         <li>to display validation messages as entries or selections lose focus</li>
         *         <li>to reformat successfully parsed textual entries</li>
         *     </ul>
         *     </li>
         *     <li>
         *         registers a focus event handler to pause the update of any existing visible validation message
         *     </li>
         *     <li>
         *         registers a key-up event handler which validates the entry as it's being entered; this allows other
         *         entries that are shown conditionally to be available before the user tabs out of this entry
         *     </li>
         * </ul>
         * @name ko.bindingHandlers.validatedValue
         */
        koBindingHandlers.validatedValue = {
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

                tagName = ko.utils.tagNameLower(element);
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
                //noinspection JSCheckFunctionSignatures
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
    })();

    // Define binding handlers which control the display of element based on a validation state.
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

        /**
         * Disables the element when the chosen property or model has failed or is pending validation, enabled
         * otherwise.
         * @name ko.bindingHandlers.disabledWhenNotValid
         */
        koBindingHandlers.disabledWhenNotValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.passed();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Disables the element when the chosen property or model has been touched and has failed or is pending
         * validation, enabled otherwise.<br/>
         * @name ko.bindingHandlers.disabledWhenTouchedAndNotValid
         */
        koBindingHandlers.disabledWhenTouchedAndNotValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = validationState.touched() && !validationState.passed();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Enables the element when the chosen property or model is applicable, disabled otherwise.
         * @name ko.bindingHandlers.enabledWhenApplicable
         */
        koBindingHandlers.enabledWhenApplicable = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.settings.applicable();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Sets the text of the element to be a formatted representation of the specified property.
         * @name ko.bindingHandlers.formattedValue
         */
        koBindingHandlers.formattedValue = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor) {
                var bindings = allBindingsAccessor(),
                    observableOrComputedOrValue = valueAccessor(),
                    value = ko.utils.unwrapObservable(observableOrComputedOrValue),
                    validationState = getValidationState(observableOrComputedOrValue),
                    formatter = converters.passThrough.format,
                    valueFormat;

                if (validationState) {
                    formatter = validationState.settings.converter.format;
                    valueFormat = validationState.settings.valueFormat;
                }

                //noinspection JSUnresolvedVariable
                formatter = bindings.formatter || formatter;
                if (valueFormat == null) {
                    valueFormat = bindings.valueFormat;
                }

                ko.utils.setTextContent(element, formatter(value, valueFormat));
            });

        /**
         * Sets CSS classes on the element based on the validation state of the chosen property or model.</br>
         * The names of the CSS classes used are held in the <b>ko.bindingHandlers.validationCss.classNames</b> object,
         * by default they are:
         * <ul>
         *     <li><b>failed</b> - if validation failed</li>
         *     <li><b>focused</b> - if the element is in focus</li>
         *     <li><b>passed</b> - if validation passed</li>
         *     <li><b>pending</b> - if validation is pending</li>
         *     <li><b>touched</b> - set if the element has been "touched"</li>
         *     <li><b>untouched</b> - set if the element has not been "touched"</li>
         * </ul>
         * @name ko.bindingHandlers.validationCss
         */
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

        /**
         * The class names used by the <b>ko.bindingHandlers.validationCss</b> binding.
         */
        koBindingHandlers.validationCss.classNames = {
            "failed": "failed",
            "focused": "focused",
            "passed": "passed",
            "pending": "pending",
            "touched": "touched",
            "untouched": "untouched"
        };

        /**
         * Makes the element behave like a validation message for the chosen property or model:
         * <ul>
         *     <li>makes the element visible if the value is invalid</li>
         *     <li>sets the text of the element to be the underlying validation state's message</li>
         * </ul>
         * @name ko.bindingHandlers.validationMessageFor
         */
        koBindingHandlers.validationMessageFor = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.showMessage());
                    ko.utils.setTextContent(element, validationState.message());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible when the entry bound to the chosen property is in focus, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenFocused
         */
        koBindingHandlers.visibleWhenFocused = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.focused());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible when the chosen property or model has failed validation, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenInvalid
         */
        koBindingHandlers.visibleWhenInvalid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.failed());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible when the summary for the chosen model is not empty, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenSummaryNotEmpty
         */
        koBindingHandlers.visibleWhenSummaryNotEmpty = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.summary().length > 0);
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible if the chosen property or model has been touched, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenTouched
         */
        koBindingHandlers.visibleWhenTouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible if the chosen property or model is untouched, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenUntouched
         */
        koBindingHandlers.visibleWhenUntouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, !validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible if the chosen property or model has passed validation.
         * @name ko.bindingHandlers.visibleWhenValid
         */
        koBindingHandlers.visibleWhenValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.passed());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });
    })();
})();

(function () {
    "use strict";

    var
        koCheckedBindingHandler = ko.bindingHandlers.checked,
        koValueBindingHandler = ko.bindingHandlers.value;

    /**
     * Contains helper functions for working with valerie's Knockout binding handlers.
     * @namespace
     */
    valerie.koBindingsHelper = {
        /**
         * Restores the original <b>checked</b> and <b>value</b> binding handlers.
         * @name valerie.koBindingsHelper#useOriginalBindingHandlers
         * @function
         */
        "useOriginalBindingHandlers": function () {
            ko.bindingHandlers.checked = koCheckedBindingHandler;
            ko.bindingHandlers.value = koValueBindingHandler;
        },
        /**
         * Replaces the <b>checked</b> and <b>value</b> binding handlers with the validating equivalents.
         * @name valerie.koBindingsHelper#useValidatingBindingHandlers
         * @function
         */
        "useValidatingBindingHandlers": function () {
            ko.bindingHandlers.checked = ko.bindingHandlers.validatedChecked;
            ko.bindingHandlers.value = ko.bindingHandlers.validatedValue;
        }
    };
})();