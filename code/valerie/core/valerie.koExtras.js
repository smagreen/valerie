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
