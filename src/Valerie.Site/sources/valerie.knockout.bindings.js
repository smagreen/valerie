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
