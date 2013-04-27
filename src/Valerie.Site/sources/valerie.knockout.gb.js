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
        constructor = valerie.knockout.PropertyValidationState,
        prototype = constructor.prototype,
        poundsDefaultOptions = {
            "entryFormat": ",",
            "valueFormat": "£,"
        };

    prototype.pounds = function (options) {
        options = utils.mergeOptions(poundsDefaultOptions, options);

        this.settings.entryFormat = options.entryFormat;
        this.settings.valueFormat = options.valueFormat;
        this.settings.converter = converters.pounds;

        return this;
    };

    constructor.pounds = { "defaultOptions": poundsDefaultOptions };
})();
