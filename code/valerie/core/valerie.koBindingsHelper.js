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