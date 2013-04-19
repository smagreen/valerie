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
        setElementVisibility = function (element, newVisibility) {
            var currentVisibility = (element.style.display !== "none");
            if (currentVisibility === newVisibility) {
                return;
            }

            element.style.display = (newVisibility) ? "" : "none";
        };

    (function () {
        var emptyInitFunction = function () {
        };

        // isolatedBindingHandler factory function
        // - creates a binding handler in which update is called only when a dependency changes and not when another
        //   binding changes
        knockout.isolatedBindingHandler = function (initOrUpdateFunction, updateFunction) {
            var initFunction = (arguments.length === 1) ? emptyInitFunction : initOrUpdateFunction;
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
    })();

    // Define validatedChecked and validatedValue binding handlers.
    (function () {
        var checkedBindingHandler = ko.bindingHandlers.checked,
            validatedCheckedBindingHandler,
            valueBindingHandler = ko.bindingHandlers.value,
            validatedValueBindingHandler,
            blurHandler = function (element, observableOrComputed) {
                var validationState = knockout.getState(observableOrComputed);

                validationState.touched(true);
                validationState.boundEntry.focused(false);
                validationState.message.resume();
                validationState.showState.resume();
            },
            textualInputBlurHandler = function (element, observableOrComputed) {
                var validationState = knockout.getState(observableOrComputed);

                if (validationState.boundEntry.result.peek().failed) {
                    return;
                }

                element.value = validationState.options.converter.formatter(observableOrComputed.peek());
            },
            textualInputFocusHandler = function (element, observableOrComputed) {
                var validationState = knockout.getState(observableOrComputed);

                validationState.boundEntry.focused(true);
                validationState.message.pause();
                validationState.showState.pause();
            },
            textualInputKeyUpHandler = function (element, observableOrComputed) {
                var enteredValue = ko.utils.stringTrim(element.value),
                    parsedValue,
                    validationState = knockout.getState(observableOrComputed),
                    options = validationState.options;

                if (enteredValue.length === 0 && options.required()) {
                    observableOrComputed(undefined);

                    validationState.boundEntry.result(new knockout.ValidationResult(true,
                        options.missingFailureMessage));

                    return;
                }

                parsedValue = options.converter.parser(enteredValue);
                observableOrComputed(parsedValue);

                if (parsedValue === valerie.invalid) {
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

                element.value = validationState.options.converter.formatter(value, validationState.options.valueFormat);
            };

        // validatedChecked binding handler
        // - functions in the same way as the "checked" binding handler
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
        // - with the exception of textual inputs, functions in the same way as the "value" binding handler
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
                    textualInputBlurHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "focus", function () {
                    textualInputFocusHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "keyup", function () {
                    textualInputKeyUpHandler(element, observableOrComputed);
                });

                // Ensure the textual input's value is changed only when the observable or computed is changed, not when
                // another binding is changed.
                ko.computed({
                    "read": function () {
                        textualInputUpdateFunction(observableOrComputed, validationState, element);
                    },
                    "disposeWhenNodeIsRemoved": element
                });
            },
            "update": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState;

                if (knockout.hasState(observableOrComputed)) {
                    validationState = knockout.getState(observableOrComputed);

                    if (validationState.boundEntry.textualInput) {
                        return;
                    }
                }

                valueBindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);
            }
        };

        // Record the original binding handlers
        knockout.originalBindingHandlers = {
            "checked": checkedBindingHandler,
            "value": valueBindingHandler
        };

        // Explicitly make available the validating binding handlers.
        knockout.validatingBindingHandlers = {
            "checked": validatedCheckedBindingHandler,
            "value": validatedValueBindingHandler
        };

        ko.bindingHandlers.validatedChecked = validatedCheckedBindingHandler;
        ko.bindingHandlers.validatedValue = validatedValueBindingHandler;

        // Replaces the original "checked" and "value" binding handlers with validating equivalents.
        knockout.useValidatingBindingHandlers = function () {
            ko.bindingHandlers.checked = validatedCheckedBindingHandler;
            ko.bindingHandlers.value = validatedValueBindingHandler;
            ko.bindingHandlers.koChecked = checkedBindingHandler;
            ko.bindingHandlers.koValue = valueBindingHandler;
        };

        // Restores the original "checked" and "value" binding handlers.
        knockout.useOriginalBindingHandlers = function () {
            ko.bindingHandlers.checked = checkedBindingHandler;
            ko.bindingHandlers.value = valueBindingHandler;
        };
    })();

    // applicability binding handlers
    ko.bindingHandlers.enabledWhenApplicable = knockout.isolatedBindingHandler(
        function (element, valueAccessor, allBindingsAccessor) {
            var bindings,
                value = valueAccessor(),
                validationState;

            if (value === true) {
                bindings = allBindingsAccessor();

                value = bindings["value"] ||
                    bindings["checked"] ||
                    bindings["validatedValue"] ||
                    bindings["validatedChecked"];
            }

            if (!knockout.hasState(value))
                return;

            validationState = knockout.getState(value);
            element.disabled = !validationState.options.applicable();
        });

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
        ko.bindingHandlers.visibleWhenInvalid = knockout.isolatedBindingHandler(
            function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.failed();
                });
            });

        // visibleWhenValid binding handler
        // - makes the bound element visible if the value is valid, invisible otherwise
        ko.bindingHandlers.visibleWhenValid = knockout.isolatedBindingHandler(
            function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.passed();
                });
            });
    })();

    // validationMessageFor binding handler
    // - makes the bound element visible if the value is invalid
    // - sets the text of the bound element to be the validation message
    ko.bindingHandlers.validationMessageFor = knockout.isolatedBindingHandler(
        function (element, valueAccessor) {
            var observableOrComputed = valueAccessor(),
                validationState = knockout.getState(observableOrComputed);

            if (!knockout.hasState(observableOrComputed))
                return;

            setElementVisibility(element, validationState.showState());
            ko.utils.setTextContent(element, validationState.message());
        });
})();
