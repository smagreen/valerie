// valerie.rules
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
/// <reference path="valerie.core.js"/>

(function () {
    "use strict";

    var rules = valerie.rules,
        utils = valerie.utils;

    rules.successfulTestResult = {
        "failed": false,
        "failedMessage": ""
    };

    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        this.minimum = (typeof minimumValueOrFunction === "function") ?
            minimumValueOrFunction :
            function () { return minimumValueOrFunction; };
        
        this.maximum = (typeof maximumValueOrFunction === "function") ?
            maximumValueOrFunction :
            function () { return maximumValueOrFunction; };

        this.options = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failedMessageFormatWithMinimumOnly": "The value must be no less than {minimum}.",
        "failedMessageFormatWithMaximumOnly": "The value must be no greater than {maximum}.",
        "failedMessageFormatForRange": "The value must be between {minimum} and {maximum}.",
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function(value) {
            var failed = true,
                failedMessage,
                failedMessageFormat = options.failedMessageFormatForRange,
                minimum = this.minimum(),
                maximum = this.maximum();

            if ((minimum === undefined || minimum === null) && (maximum === undefined || maximum === null)) {
                return rules.successfulTestResult;
            }

            if (minimum === undefined || minimum === null) {
                failedMessageFormat = options.failedMessageFormatWithMaximumOnly;
            }
            
            if (maximum === undefined || maximum === null) {
                failedMessageFormat = options.failedMessageFormatWithMinimumOnly;
            }
            
            if (value !== undefined && value !== null) {
                failedMessage = utils.formatString(
                    this.options.failedMessageFormat, {
                        "maximum": this.options.valueFormatter(maximum),
                        "value": this.options.valueFormatter(value)
                    });

                return {
                    "failed": true,
                    "failedMessage": failedMessage
                };
            }

            return rules.successfulTestResult;
        }
    };
    
    // ToDo: After
    // ToDo: Before
    // ToDo: Minimum
    // ToDo: Range

})();