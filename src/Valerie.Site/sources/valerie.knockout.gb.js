// valerie.knockout.gb
// - additional fluent methods for using converters particular to Great Britain
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.knockout.js"/>

/*global valerie: false */

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

        this.settings.entryFormat = options.entryFormat;
        this.settings.valueFormat = options.valueFormat;
        this.settings.converter = converters.money;

        return this;
    };

    valerie.knockout.PropertyValidationState.prototype.money.defaultOptions = moneyDefaultOptions;
})();
