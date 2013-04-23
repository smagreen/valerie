// valerie.knockout.gb
// - additional fluent methods for using converters particular to Great Britain
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.knockout.js"/>

/*global valerie: false */
if (typeof valerie === "undefined" || !valerie.utils) throw "valerie.utils is required.";
if (!valerie.knockout) throw "valerie.knockout is required.";

(function () {
    "use strict";

    var converters = valerie.converters,
        utils = valerie.utils,
        moneyDefaultOptions = {
            "entryFormat": undefined,
            "valueFormat": "£"
        };

    valerie.knockout.PropertyValidationState.prototype.money = function (options) {
        options = utils.mergeOptions(moneyDefaultOptions, options);

        this.options.entryFormat = options.entryFormat;
        this.options.valueFormat = options.valueFormat;
        this.options.converter = converters.money;

        return this;
    };

    valerie.knockout.PropertyValidationState.prototype.money.defaultOptions = moneyDefaultOptions;
})();
