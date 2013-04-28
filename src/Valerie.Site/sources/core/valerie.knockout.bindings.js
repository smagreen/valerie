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

        // + invisibleWhenTouched binding handler
        // - makes the bound element invisible if the value has been touched, visible otherwise
        koBindingHandlers.visibleWhenTouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, !validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        // + visibleWhenFailuresInSnapshot binding handler
        // - makes the bound element visible if there are failures in the failures snapshot
        koBindingHandlers.visibleWhenFailuresInSnapshot = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.failuresSnapshot().length > 0);
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
