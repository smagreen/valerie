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
         * Sets the text of the element to be the underlying validation state's message.
         * @name ko.bindingHandlers.validationMessage
         */
        koBindingHandlers.validationMessage = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
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
