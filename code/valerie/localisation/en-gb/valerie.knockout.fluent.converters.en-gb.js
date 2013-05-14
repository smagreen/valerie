// valerie.knockout.fluent.converters.en-gb
// - additional functions for the PropertyValidationState prototype for fluently specifying converters

(function () {
    "use strict";

    var converters = valerie.converters,
        prototype = valerie.PropertyValidationState.prototype;

    // + postcode
    prototype.postcode = function () {
        this.settings.converter = converters.postcode;

        return this;
    };
})();
