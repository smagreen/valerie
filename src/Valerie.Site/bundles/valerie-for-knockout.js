///#source 1 1 ../sources/core/valerie.validationResult.js
// valerie.validationResult
// - defines the ValidationResult constructor function
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    // + ValidationResult
    // - the result of a validation test
    valerie.ValidationResult = function (failed, failureMessage) {
        this.failed = failed;
        this.failureMessage = failureMessage;
    };

    valerie.ValidationResult.success = new valerie.ValidationResult(false, "");
})();

///#source 1 1 ../sources/core/valerie.utils.js
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

///#source 1 1 ../sources/core/valerie.formatting.js
// valerie.formatting
// - general purpose formatting functions
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var formatting = valerie.formatting = valerie.formatting || {};

    // + format.replacePlaceholders
    formatting.replacePlaceholders = function (format, replacements) {
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
})();

///#source 1 1 ../sources/core/valerie.passThrough.js
// valerie.passThrough
// - the pass through converter and rule
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.validationResult.js"/>

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var ValidationResult = valerie.ValidationResult,
        // ReSharper restore InconsistentNaming
        converters = valerie.converters = valerie.converters || {},
        rules = valerie.rules = valerie.rules || {};

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

    // + rules.PassThrough
    rules.PassThrough = function () {
        this.settings = {};
    };

    rules.PassThrough.prototype = {
        "test": function () {
            return ValidationResult.success;
        }
    };
})();

///#source 1 1 ../sources/core/valerie.knockout.extras.js
// valerie.knockout.extras
// - extra functionality for KnockoutJS
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../../frameworks/knockout-2.2.1.debug.js"/>

/*global ko: false, valerie: true */

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

///#source 1 1 ../sources/core/valerie.dom.js
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


///#source 1 1 ../sources/core/valerie.knockout.js
// valerie.knockout
// - the class and functions that validate a view-model constructed using knockout observables and computeds
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.validationResult.js"/>
/// <reference path="valerie.passThrough.js"/>
/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.formatting.js"/> 
/// <reference path="valerie.extras.js"/>

/*global ko: false, valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var ValidationResult = valerie.ValidationResult,
        // ReSharper restore InconsistentNaming
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
        var failedFunction = function () {
            return this.result().failed;
        },
            invalidStatesFunction = function () {
                var invalidStates = [],
                    validationStates = this.validationStates(),
                    validationState,
                    result,
                    index;

                for (index = 0; index < validationStates.length; index++) {
                    validationState = validationStates[index];

                    if (validationState.settings.applicable()) {
                        result = validationStates[index].result();

                        if (result.failed) {
                            invalidStates.push(validationState);
                        }
                    }
                }

                return invalidStates;
            },
            messageFunction = function () {
                return this.result().failureMessage;
            },
            passedFunction = function () {
                return !this.result().failed;
            },
            resultFunction = function () {
                var invalidStates = this.invalidStates();

                if (invalidStates.length === 0) {
                    return ValidationResult.success;
                }

                return new ValidationResult(true, this.settings.failureMessageFormat);
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

            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.invalidStates = koComputed(invalidStatesFunction, this, deferEvaluation);
            this.message = koComputed(messageFunction, this, deferEvaluation);
            this.model = model;
            this.settings = options;
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.result = extras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);
            this.summary = koObservable([]);
            this.touched = koComputed({
                "read": touchedReadFunction,
                "write": touchedWriteFunction,
                "deferEvaluation": true,
                "owner": this
            });
            this.validationStates = ko.observableArray();

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
                if (valueOrFunction === undefined) {
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
                var states = this.invalidStates(),
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
            "paused": undefined
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
            ruleResultFunction = function () {
                var value = this.observableOrComputed();

                return this.settings.rule.test(value);
            },
            // Functions for computeds.
            failedFunction = function () {
                return this.result().failed;
            },
            messageFunction = function () {
                var message = this.result().failureMessage;

                message = formatting.replacePlaceholders(message, { "name": this.settings.name() });

                return message;
            },
            passedFunction = function () {
                return !this.result().failed;
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
                    return {
                        "failed": true,
                        "failureMessage": this.settings.missingFailureMessage
                    };
                }

                if (missingResult === 0) {
                    return result;
                }

                result = ruleResultFunction.apply(this);
                if (result.failed) {
                    return result;
                }

                return ValidationResult.success;
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
                "result": koObservable(ValidationResult.success),
                "textualInput": false
            };

            this.failed = koComputed(failedFunction, this, deferEvaluation);
            this.message = extras.pausableComputed(messageFunction, this, deferEvaluation);
            this.observableOrComputed = observableOrComputed;
            this.settings = options;
            this.passed = koComputed(passedFunction, this, deferEvaluation);
            this.result = koComputed(resultFunction, this, deferEvaluation);
            this.showMessage = extras.pausableComputed(showMessageFunction, this, deferEvaluation);
            this.touched = koObservable(false);
        };

        definition.prototype = {
            // Validation state methods support a fluent interface.
            "applicable": function (valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.settings.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "end": function () {
                this.settings.rule.settings.valueFormat = this.settings.valueFormat;
                this.settings.rule.settings.valueFormatter = this.settings.converter.formatter;

                return this.observableOrComputed;
            },
            "name": function (valueOrFunction) {
                this.settings.name = utils.asFunction(valueOrFunction);

                return this;
            },
            "required": function (valueOrFunction) {
                if (valueOrFunction === undefined) {
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
            "entryFormat": undefined,
            "invalidEntryFailureMessage": "",
            "missingFailureMessage": "",
            "missingTest": utils.isMissing,
            "name": utils.asFunction(),
            "required": utils.asFunction(false),
            "rule": new valerie.rules.PassThrough(),
            "valueFormat": undefined
        };
    })();
})();

///#source 1 1 ../sources/core/valerie.knockout.bindings.js
// valerie.knockout.bindings
// - knockout bindings for:
//   - validating user entries
//   - showing the validation state of a view-model
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.validationResult.js"/>
/// <reference path="valerie.utils.js"/>
/// <reference path="valerie.dom.js"/>
/// <reference path="valerie.knockout.extras.js"/>
/// <reference path="valerie.knockout.js"/>

/*global ko: false, valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var ValidationResult = valerie.ValidationResult,
        // ReSharper restore InconsistentNaming
        utils = valerie.utils,
        knockout = valerie.knockout,
        koBindingHandlers = ko.bindingHandlers,
        koRegisterEventHandler = ko.utils.registerEventHandler,
        setElementVisibility = valerie.dom.setElementVisibility,
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
                    settings = validationState.settings;

                if (enteredValue.length === 0 && settings.required()) {
                    observableOrComputed(undefined);

                    validationState.boundEntry.result(new ValidationResult(true, settings.missingFailureMessage));

                    return;
                }

                parsedValue = settings.converter.parser(enteredValue);
                observableOrComputed(parsedValue);

                if (parsedValue === undefined) {
                    validationState.boundEntry.result(new ValidationResult(true, settings.invalidEntryFailureMessage));

                    return;
                }

                validationState.boundEntry.result(ValidationResult.success);
            },
            textualInputUpdateFunction = function (observableOrComputed, validationState, element) {
                // Get the value so this function becomes dependent on the observable or computed.
                var value = observableOrComputed();

                // Prevent a focused element from being updated by the model.
                if (validationState.boundEntry.focused.peek()) {
                    return;
                }

                validationState.boundEntry.result(ValidationResult.success);

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
                    if (validationState.settings.name() === undefined) {
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
                    tagName = ko.utils.tagNameLower(element),
                    textualInput,
                    validationState = getValidationState(observableOrComputed);

                if (!validationState) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                if (validationState.settings.name() === undefined) {
                    validationState.settings.name = utils.asFunction(element.name);
                }

                koRegisterEventHandler(element, "blur", function () {
                    blurHandler(element, observableOrComputed);
                });

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
                var bindings,
                    value = valueAccessor(),
                    validationState;

                if (value === true) {
                    bindings = allBindingsAccessor();
                    value = bindings.value || bindings.checked ||
                        bindings.validatedValue || bindings.validatedChecked ||
                        viewModel;
                }

                validationState = getValidationState(value);

                if (validationState) {
                    functionToApply(validationState);
                }
            };

        // + enabledWhenApplicable binding handler
        koBindingHandlers.enableWhenApplicable = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.settings.applicable();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + validationCss binding handler
        // - sets CSS classes on the bound element depending on the validation status of the value:
        //   - error: if validation failed
        //   - passed: if validation passed
        //   - touched: if the bound element has been touched
        // - the names of the classes used are held in the bindingHandlers.validationCss.classNames object
        koBindingHandlers.validationCss = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    var classNames = koBindingHandlers.validationCss.classNames;

                    // ToDo: Need a better function for toggling Css classes en-masse.
                    ko.utils.toggleDomNodeCssClass(element, classNames.failed, validationState.failed());
                    ko.utils.toggleDomNodeCssClass(element, classNames.passed, validationState.passed());
                    ko.utils.toggleDomNodeCssClass(element, classNames.touched, validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        koBindingHandlers.validationCss.classNames = {
            "failed": "error",
            "passed": "success",
            "touched": "touched"
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

        // + invisibleWhenSummaryEmpty binding handler
        // - makes the bound element invisible if the validation summary is empty, visible otherwise
        koBindingHandlers.invisibleWhenSummaryEmpty = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.summary().length > 0);
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + invisibleWhenTouched binding handler
        // - makes the bound element invisible if the value has been touched, visible otherwise
        koBindingHandlers.visibleWhenTouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, !validationState.touched());
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

///#source 1 1 ../sources/extras/valerie.converters.js
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

    // + converters.number
    converters.number = {
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

            value = Number(value);

            if (isNaN(value)) {
                return undefined;
            }

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

///#source 1 1 ../sources/extras/valerie.rules.js
// valerie.rules
// - general purpose rules
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.validationResult.js"/>
/// <reference path="../core/valerie.passThrough.js"/>
/// <reference path="../core/valerie.utils.js"/>

/*global valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var ValidationResult = valerie.ValidationResult,
        // ReSharper restore InconsistentNaming
        rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils,
        formatting = valerie.formatting;

    // ToDo: During (Range for dates and times).

    // + rules.Range
    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "2 or 3 arguments expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.settings = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "failureMessageFormatForRange": "",
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function (value) {
            var failureMessage,
                failureMessageFormat = this.settings.failureMessageFormatForRange,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum !== undefined && maximum !== null,
                haveMinimum = minimum !== undefined && minimum !== null,
                haveValue = value !== undefined && value !== null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return ValidationResult.success;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return ValidationResult.success;
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "maximum": this.settings.valueFormatter(maximum, this.settings.valueFormat),
                    "minimum": this.settings.valueFormatter(minimum, this.settings.valueFormat),
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return {
                "failed": true,
                "failureMessage": failureMessage
            };
        }
    };
})();

///#source 1 1 ../sources/extras/valerie.knockout.fluent.js
// valerie.knockout.fluent
// - additional functions for the PropertyValidationState prototype for specifying converts and rules in a fluent manner
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.knockout.js"/>
/// <reference path="valerie.converters.js"/>
/// <reference path="valerie.rules.js"/>

/*global ko: false, valerie: false */

(function () {
    "use strict";

    var prototype = valerie.knockout.PropertyValidationState.prototype,
        converters = valerie.converters,
        rules = valerie.rules;

    // + between
    prototype.between = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        this.settings.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);

        return this;
    };

    // + number
    prototype.number = function () {
        this.settings.converter = converters.number;

        return this;
    };
})();


