(function () {
    "use strict";

    /**
     * Contains utilities for working with validation states.
     * @namespace
     */
    valerie.validationState = {};

    var getValidationStateMethodName = "validation",
        utils = valerie.utils;

    /**
     * Finds and returns the validation states of:
     * <ul>
     *     <li>immediate properties of the given model</li>
     *     <li>immediate sub-models of the given model, if specified</li>
     *     <li>descendant properties of the given model, if specified</li>
     *     <li>descendant sub-models of the given model, if specified</li>
     * </ul>
     * @param {object} model the model to find validation states in
     * @param {boolean} [includeSubModels = true] whether to return the validation states of child
     * sub-models
     * @param {boolean} [recurse = false] whether to inspect the descendant properties and, if specified,
     * descendant sub-models of child sub-models
     * @param {array.<valerie.IValidationState>} [validationStates] the already inspected validation states; this
     * parameter is used in recursive invocations
     */
    valerie.validationState.findIn = function (model, includeSubModels, recurse, validationStates) {
        if (!(1 in arguments)) {
            includeSubModels = true;
        }

        if (!(2 in arguments)) {
            recurse = false;
        }

        if (!(3 in arguments)) {
            //noinspection JSValidateTypes
            validationStates = [];
        }

        var name,
            validationState,
            value;

        for (name in model) {
            if (model.hasOwnProperty(name)) {
                value = model[name];

                if (value == null) {
                    continue;
                }

                validationState = valerie.validationState.getFor(value);

                if (ko.isObservable(value)) {
                    value = value.peek();
                }

                if (utils.isFunction(value)) {
                    continue;
                }

                if (validationState) {
                    if (validationState instanceof valerie.PropertyValidationState) {
                        //noinspection JSUnresolvedFunction
                        validationStates.push(validationState);
                    }

                    else if (includeSubModels) {
                        //noinspection JSUnresolvedFunction
                        validationStates.push(validationState);

                    }
                }

                if (recurse && utils.isArrayOrObject(value)) {
                    //noinspection JSValidateTypes
                    valerie.validationState.findIn(value, includeSubModels, true, validationStates);
                }
            }
        }

        return validationStates;
    };

    /**
     * Gets the validation state for the given model, observable or computed.<br>
     * If the model is known to have a validation state, the construct <code>model.validation()</code> can also be used
     * retrieve it.<br/>
     * <i>This function is useful when developing binding handlers.</i>
     * @param {object|function} modelOrObservableOrComputed the thing to get the validation state for
     * @return {null|valerie.IValidationState} the validation state or <code>null</code> if the given thing does not
     * have a validation state.
     */
    valerie.validationState.getFor = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return null;
        }

        if (!modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName)) {
            return null;
        }

        return modelOrObservableOrComputed[getValidationStateMethodName]();
    };

    /**
     * Informs if the given model, observable or computed has a validation state.<br/>
     * <i>This function is useful when developing binding handlers.</i>
     * @param {object|function} modelOrObservableOrComputed the thing to test
     * @return {boolean} whether the given thing has a validation state
     */
    valerie.validationState.has = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return false;
        }

        return modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName);
    };

    /**
     * Sets the validation state for the given model, observable or computed.
     * @param {object|function} modelOrObservableOrComputed the thing to set the validation state on
     * @param {valerie.IValidationState} state the validation state to use
     */
    valerie.validationState.setFor = function (modelOrObservableOrComputed, state) {
        modelOrObservableOrComputed[getValidationStateMethodName] = function () {
            return state;
        };
    };
})();
