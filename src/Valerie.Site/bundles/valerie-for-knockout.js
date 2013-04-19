///#source 1 1 ../bundles/valerie-for-knockout.license.js
"valerie for knockout (c) 2013 egrove Ltd. License: MIT (http://www.opensource.org/licenses/mit-license.php)";
///#source 1 1 ../sources/valerie.core.js
// valerie.core
// - the core namespaces, objects and utility functions
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

(function () {
    // ReSharper disable AssignToImplicitGlobalInFunctionScope
    if (typeof valerie === "undefined") {
        valerie = {};
    }

    valerie = valerie || {};
    // ReSharper restore AssignToImplicitGlobalInFunctionScope

    valerie.converters = valerie.converters || {};
    valerie.rules = valerie.rules || {};
    valerie.utils = valerie.utils || {};
})();

(function () {
    "use strict";

    var utils = valerie.utils;

    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };

    utils.formatString = function (format, replacements) {
        if (replacements === undefined || replacements === null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];
            return typeof replacement === "string" ? replacement : match;
        });
    };

    utils.isArray = function (value) {
        return {}.toString.call(value) === "[object Array]";
    };

    utils.isFunction = function (value) {
        if (value === undefined || value === null) {
            return false;
        }

        return (typeof value === "function");
    };

    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

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

    utils.isMissing = function (value) {
        if (value === undefined || value === null) {
            return true;
        }

        if (value.length === 0) {
            return true;
        }

        return false;
    };
})();

(function () {
    "use strict";

    var converters = valerie.converters;

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
})();

(function() {
    "use strict";

    var rules = valerie.rules;

    rules.passThrough = {
        "test": function() {
            return rules.successfulTestResult;
        }
    };

    rules.successfulTestResult = {
        "failed": false,
        "failureMessage": ""
    };
})();

///#source 1 1 ../sources/valerie.converters.js
// valerie.converters
// - general purpose converters for use with valerie
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
/// <reference path="valerie.core.js"/>

(function () {
    "use strict";

    var converters = valerie.converters;

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
            
            // ToDo: Change this very noddy, permissive implementation.
            var parsedValue = parseInt(value, 10);
            
            if (isNaN(parsedValue)) {
                return undefined;
            }

            return parsedValue;
        }
    };

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


///#source 1 1 ../sources/valerie.rules.js
// valerie.rules
// - general purpose rules for use with valerie
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
// <reference path="valerie.core.js"/>

(function () {
    "use strict";

    var rules = valerie.rules,
        utils = valerie.utils;

    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "2 or 3 arguments expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.options = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormatForMinimumOnly": "The value must be no less than {minimum}.",
        "failureMessageFormatForMaximumOnly": "The value must be no greater than {maximum}.",
        "failureMessageFormatForRange": "The value must be between {minimum} and {maximum}.",
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
                    "maximum": this.options.valueFormatter(maximum),
                    "minimum": this.options.valueFormatter(minimum),
                    "value": this.options.valueFormatter(value)
                });

            return {
                "failed": true,
                "failureMessage": failureMessage
            };
        }
    };

    // ToDo: During (Range for dates and times).
})();

///#source 1 1 ../sources/valerie.knockout.core.js
// valerie.knockout.core
// - the core namespaces and objects for using valerie with knockout
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global ko: false, valerie: false */
/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.core.js"/>

(function () {
    var statePropertyName = "__valerie_knockout_state";

    if (typeof ko === "undefined") {
        throw "KnockoutJS is required. Please reference it before referencing this library.";
    }

    // Define functions for getting, setting and testing the existence of the underlying validation state.
    valerie.knockout = {
        "getState": function (observableOrComputed) {
            return observableOrComputed[statePropertyName];
        },
        "hasState": function (observableOrComputed) {
            return observableOrComputed.hasOwnProperty(statePropertyName);
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
        // pausableComputed factory function
        // - a Knockout computed whose evaluation can be paused and resumed
        var pausableComputed = function (evaluatorFunction, evaluatorFunctionTarget, options) {
            var lastValue,
                paused = ko.observable(false),
                computed = ko.computed(function () {
                    if (paused()) {
                        return lastValue;
                    }

                    return evaluatorFunction.call(evaluatorFunctionTarget);
                }, evaluatorFunctionTarget, options);

            computed.pause = function () {
                lastValue = this();
                paused(true);
            }.bind(computed);

            computed.resume = function () {
                paused(false);
            };

            return computed;
        };

        // ValidationContext
        // - aggregates validatable observables or computeds
        // - records whether an attempt has been made to submit them
        // - ToDo: can be used to determine if any them are invalid
        knockout.ValidationContext = function () {
            this.status = ko.observableArray();
            this.submissionAttempted = ko.observable(false);
        };

        knockout.ValidationContext.prototype = {
            "anyFailed": function () {
            }
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
                showMessageFunction = function () {
                    return this.boundEntry.result().failed ||
                        (this.touched() && failedFunction.apply(this));
                };

            // Constructor Function
            // - validation state for a single observable or computed
            // - options can be modified using a fluent interface
            knockout.ValidationState = function (observableOrComputed, options) {
                options = utils.mergeOptions(knockout.ValidationState.defaultOptions, options);
                options.applicable = utils.asFunction(options.applicable);
                options.required = utils.asFunction(options.required);
                this.options = options;

                this.boundEntry = {
                    "focused": ko.observable(false),
                    "result": ko.observable(knockout.ValidationResult.success),
                    "textualInput": false
                };

                this.observableOrComputed = observableOrComputed;
                this.failed = ko.computed(failedFunction, this, { "deferEvaluation": true });
                this.message = pausableComputed(messageFunction, this, { "deferEvaluation": true });
                this.passed = ko.computed(passedFunction, this, { "deferEvaluation": true });
                this.result = ko.computed(resultFunction, this, { "deferEvaluation": true });
                this.showMessage = pausableComputed(showMessageFunction, this, { "deferEvaluation": true });
                this.touched = ko.observable(false);
            };
        })();

        // Add methods for modifying state in a fluent manner.
        knockout.ValidationState.prototype = {
            "applicable": function (valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.options.applicable = utils.asFunction(valueOrFunction);

                return this;
            },
            "defaultValue": function(valueOrFunction) {
                this.options.defaultValue = utils.asFunction(valueOrFunction);

                return this;
            },
            "end": function () {
                return this.observableOrComputed;
            },
            "required": function (valueOrFunction) {
                if (valueOrFunction === undefined) {
                    valueOrFunction = true;
                }

                this.options.required = utils.asFunction(valueOrFunction);

                return this;
            }
        };

        knockout.ValidationState.defaultOptions = {
            "applicable": utils.asFunction(true),
            "context": knockout.ValidationContext.defaultContext,
            "converter": converters.passThrough,
            "defaultValue": utils.asFunction(undefined),
            "invalidEntryFailureMessage": "The value entered is invalid.",
            "missingFailureMessage": "A value is required.",
            "missingTest": utils.isMissing,
            "required": utils.asFunction(false),
            "rule": rules.passThrough
        };
    })();

    (function () {
        var extensionFunctionName = "validation";

        ko.observable.fn[extensionFunctionName] = ko.computed.fn[extensionFunctionName] = function (validationOptions) {
            var state = knockout.getState(this);

            // Return any existing validation state.
            if (state) {
                return state;
            }

            state = new knockout.ValidationState(this, validationOptions);
            knockout.setState(this, state);

            // Return the validation state after creation, so it can be modified fluently.
            return state;
        };
    })();
})();

///#source 1 1 ../sources/valerie.knockout.bindings.js
// valerie.knockout.bindings
// - knockout bindings that use valerie
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global ko: false, valerie: false */
/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.knockout.core.js"/>

(function () {
    "use strict";

    var knockout = valerie.knockout,
        checkedBindingHandler = ko.bindingHandlers.checked,
        validatedCheckedBindingHandler,
        valueBindingHandler = ko.bindingHandlers.value,
        validatedValueBindingHandler,
        setElementVisibility = function (element, newVisibility) {
            var currentVisibility = (element.style.display !== "none");
            if (currentVisibility === newVisibility) {
                return;
            }

            element.style.display = (newVisibility) ? "" : "none";
        };

    // Define validatedChecked and validatedValue binding handlers.
    (function () {
        var blurHandler = function (element, observableOrComputed) {
            var validationState = knockout.getState(observableOrComputed);

            validationState.touched(true);
            validationState.boundEntry.focused(false);
            validationState.message.resume();
            validationState.showMessage.resume();
        },
            textEntryBlurHandler = function (element, observableOrComputed) {
                var validationState = knockout.getState(observableOrComputed);

                if (validationState.boundEntry.result.peek().failed) {
                    return;
                }

                element.value = validationState.options.converter.formatter(observableOrComputed.peek());
            },
            textEntryFocusHandler = function (element, observableOrComputed) {
                var validationState = knockout.getState(observableOrComputed);

                validationState.boundEntry.focused(true);
                validationState.showMessage.pause();
                validationState.message.pause();
            },
            textEntryKeyUpHandler = function (element, observableOrComputed) {
                var enteredValue = ko.utils.stringTrim(element.value),
                    parsedValue,
                    validationState = knockout.getState(observableOrComputed),
                    options = validationState.options;

                if (enteredValue.length === 0 && options.required()) {
                    validationState.boundEntry.result(new knockout.ValidationResult(true,
                        options.missingFailureMessage));

                    observableOrComputed(validationState.options.defaultValue());

                    return;
                }

                parsedValue = options.converter.parser(enteredValue);

                if (parsedValue === undefined) {
                    validationState.boundEntry.result(new knockout.ValidationResult(true,
                        options.invalidEntryFailureMessage));

                    observableOrComputed(validationState.options.defaultValue());

                    return;
                }

                validationState.boundEntry.result(knockout.ValidationResult.success);
                observableOrComputed(parsedValue);
            };

        // validatedChecked binding handler
        // - functions in the same way as the replaced "checked" binding handler
        // - registers a blur event handler so validation messages for missing selections can be displayed
        validatedCheckedBindingHandler = ko.bindingHandlers.validatedChecked = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor();

                checkedBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);

                if (knockout.hasState(observableOrComputed)) {
                    ko.utils.registerEventHandler(element, "blur", function () {
                        blurHandler(element, observableOrComputed);
                    });
                }
            },
            "update": checkedBindingHandler.update
        };

        // validatedValue binding handler
        // - with the exception of textual inputs, functions in the same way as the replaced "value" binding handler
        // - registers a blur event handler so validation messages for completed entries or selections can be displayed
        // - registers a blur event handler to reformat parsed textual entries
        validatedValueBindingHandler = ko.bindingHandlers.validatedValue = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    hasValidationState = knockout.hasState(observableOrComputed),
                    tagName = ko.utils.tagNameLower(element),
                    textualInput,
                    validationState;

                if (!hasValidationState) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
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

                validationState = knockout.getState(observableOrComputed);
                validationState.boundEntry.textualInput = true;

                ko.utils.registerEventHandler(element, "blur", function () {
                    textEntryBlurHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "focus", function () {
                    textEntryFocusHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "keyup", function () {
                    textEntryKeyUpHandler(element, observableOrComputed);
                });
            },
            "update": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState,
                    value;

                if (!knockout.hasState(observableOrComputed)) {
                    valueBindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                // Always get the value so this function becomes dependent on the observable or computed.
                value = observableOrComputed();

                validationState = knockout.getState(observableOrComputed);

                if (!validationState.boundEntry.textualInput) {
                    valueBindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                // Prevent a focused element from being updated by the model.
                if (validationState.boundEntry.focused.peek()) {
                    return;
                }

                validationState.boundEntry.result(knockout.ValidationResult.success);
                element.value = validationState.options.converter.formatter(value);
            }
        };

        // Record and alias the original binding handlers
        knockout.originalBindingHandlers = {
            "checked": checkedBindingHandler,
            "value": valueBindingHandler
        };

        ko.bindingHandlers.koChecked = checkedBindingHandler;
        ko.bindingHandlers.koValue = valueBindingHandler;

        // Explicitly make available the replacement binding handlers.
        knockout.replacementBindingHandlers = {
            "checked": validatedCheckedBindingHandler,
            "value": validatedValueBindingHandler
        };

        // Replaces the original "checked" and "value" binding handlers with validated equivalents.
        knockout.useValidatedBindingHandlers = function () {
            ko.bindingHandlers.checked = validatedCheckedBindingHandler;
            ko.bindingHandlers.value = validatedValueBindingHandler;
        };

        // Restores the original "checked" and "value" binding handlers.
        knockout.useOriginalBindingHandlers = function () {
            ko.bindingHandlers.checked = checkedBindingHandler;
            ko.bindingHandlers.value = valueBindingHandler;
        };
    })();

    // validationMessage binding handler
    // - makes the bound element visible if the value is invalid
    // - sets the text of the bound element to be the validation message
    ko.bindingHandlers.validationMessage = {
        "update": function (element, valueAccessor) {
            var observableOrComputed = valueAccessor(),
                validationState = knockout.getState(observableOrComputed);

            if (!knockout.hasState(observableOrComputed))
                return;

            setElementVisibility(element, validationState.showMessage());
            ko.utils.setTextContent(element, validationState.message());
        }
    };

    // visibility binding handlers
    (function () {
        var visibleDependingOnValidity = function (element, valueAccessor, determineVisibilityFunction) {
            var newVisibility,
                observableOrComputed = valueAccessor(),
                validationState;

            if (!knockout.hasState(observableOrComputed))
                return;

            validationState = knockout.getState(observableOrComputed);
            newVisibility = determineVisibilityFunction(validationState);

            setElementVisibility(element, newVisibility);
        };

        // visibleWhenInvalid binding handler
        // - makes the bound element visible if the value is invalid, invisible otherwise
        ko.bindingHandlers.visibleWhenInvalid = {
            "update": function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.failed();
                });
            }
        };

        // visibleWhenValid binding handler
        // - makes the bound element visible if the value is valid, invisible otherwise
        ko.bindingHandlers.visibleWhenValid = {
            "update": function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.passed();
                });
            }
        };
    })();
})();

///#source 1 1 ../sources/valerie.knockout.fluent.js
// valerie.knockout.fluent
// - additional functions for defining validation options on ko.observables and ko.computeds
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
/// <reference path="valerie.core.js"/>
/// <reference path="valerie.converters.js"/>
/// <reference path="valerie.rules.js"/>
/// <reference path="valerie.knockout.core.js"/>

(function () {
    "use strict";

    var converters = valerie.converters,
        prototype = valerie.knockout.ValidationState.prototype,
        rules = valerie.rules;

    prototype.between = function (minimumValueOrFunction, maximumValueOrFunction) {
        this.options.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction);
        return this;
    };

    prototype.integer = function () {
        this.options.converter = converters.integer;
        return this;
    };
})();
