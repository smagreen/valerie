// valerie.knockout.bindings
// - knockout bindings that use valerie
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global ko: false, valerie: false */
/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.knockout.core.js"/>

(function () {
    "use strict";

    var knockout = valerie.knockout;

    // validatedValue binding
    (function () {
        var validatedValueBlurHandler = function (element, observableOrComputed) {
            var validationState = knockout.getState(observableOrComputed);

            if (validationState.binding.active) {
                validationState.binding.active = false;

                if (validationState.binding.result.peek().failed) {
                    return;
                }

                element.value = validationState.options.converter.formatter(observableOrComputed());
            }
        },
            validatedValueKeyUpHandler = function (event, element, observableOrComputed) {
                var enteredValue = ko.utils.stringTrim(element.value),
                    parsedValue,
                    validationState = knockout.getState(observableOrComputed),
                    options = validationState.options;

                validationState.binding.active = true;

                if (enteredValue.length === 0 && options.required()) {
                    validationState.binding.result(new knockout.ValidationResult(true, options.missingFailureMessage));
                    return;
                }

                parsedValue = options.converter.parser(enteredValue);
                if (parsedValue === undefined) {
                    validationState.binding.result(new knockout.ValidationResult(true, options.invalidEntryFailureMessage));
                    return;
                }

                validationState.binding.result(knockout.ValidationResult.success);
                observableOrComputed(parsedValue);
            };

        ko.bindingHandlers.validatedValue = {
            "init": function (element, valueAccessor) {
                var observableOrComputed = valueAccessor(),
                    tagName = element.tagName.toLowerCase();

                if (!((tagName === "input" && element.type.toLowerCase() === "text") || tagName === "textarea")) {
                    throw "The 'validatedValue' binding can only be applied to text input and text area elements.";
                }

                if (!knockout.hasState(observableOrComputed)) {
                    throw "The 'validatedValue' binding can only be applied to validatable observables or computeds.";
                }

                // Closures to capture the element and observable or computed.
                ko.utils.registerEventHandler(element, "blur", function () {
                    validatedValueBlurHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "keyup", function (event) {
                    validatedValueKeyUpHandler(event, element, observableOrComputed);
                });
            },
            "update": function (element, valueAccessor) {
                var observableOrComputed = valueAccessor(),
                    validationState = knockout.getState(observableOrComputed);

                // Prevent the model from updating the element's value if this binding is "active".
                if (validationState.binding.active) {
                    return;
                }

                validationState.binding.result(knockout.ValidationResult.success);
                element.value = validationState.options.converter.formatter(observableOrComputed());
            }
        };
    })();

    // visibleWhenValid and visibleWhenInvalid bindings.
    (function () {
        var visibleDependingOnValidity = function (element, valueAccessor, determineVisibilityFunction) {
            var currentVisibility,
                newVisibility,
                observableOrComputed = valueAccessor(),
                validationState;

            if (!knockout.hasState(observableOrComputed))
                return;

            validationState = knockout.getState(observableOrComputed);
            currentVisibility = (element.style.display !== "none");
            newVisibility = determineVisibilityFunction(validationState);

            if (currentVisibility === newVisibility) {
                return;
            }

            element.style.display = (newVisibility) ? "" : "none";
        };

        ko.bindingHandlers.visibleWhenInvalid = {
            "update": function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.failed();
                });
            }
        };

        ko.bindingHandlers.visibleWhenValid = {
            "update": function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.passed();
                });
            }
        };
    })();
})();