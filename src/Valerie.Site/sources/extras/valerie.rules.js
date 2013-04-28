// valerie.rules
// - general purpose rules
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../core/valerie.validationResult.js"/>
/// <reference path="../core/valerie.passThrough.js"/>
/// <reference path="../core/valerie.utils.js"/>

/*global valerie: false */

(function () {
    "use strict";

    // ReSharper disable InconsistentNaming
    var ValidationResult = valerie.ValidationResult,
        // ReSharper restore InconsistentNaming
        rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils,
        formatting = valerie.formatting;

    // ToDo: During (Range for dates and times).

    // + rules.Range
    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "2 or 3 arguments expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.settings = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "failureMessageFormatForRange": "",
        "valueFormat": undefined,
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function (value) {
            var failureMessage,
                failureMessageFormat = this.settings.failureMessageFormatForRange,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum !== undefined && maximum !== null,
                haveMinimum = minimum !== undefined && minimum !== null,
                haveValue = value !== undefined && value !== null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return ValidationResult.success;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return ValidationResult.success;
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "maximum": this.settings.valueFormatter(maximum, this.settings.valueFormat),
                    "minimum": this.settings.valueFormatter(minimum, this.settings.valueFormat),
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return {
                "failed": true,
                "failureMessage": failureMessage
            };
        }
    };
})();
