// valerie.knockout.extras
// - extra functionality for KnockoutJS
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global ko: false, valerie: true */
if (typeof ko === "undefined") throw "KnockoutJS is required.";
var valerie = valerie || {};

(function () {
    "use strict";

    var knockout = valerie.knockout = valerie.knockout || {},
        extras = knockout.extras = knockout.extras || {};

    // isolatedBindingHandler factory function
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

    // pausableComputed factory function
    // - creates a computed whose evaluation can be paused and resumed
    extras.pausableComputed = function (evaluatorFunction, evaluatorFunctionTarget, options) {
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
})();
