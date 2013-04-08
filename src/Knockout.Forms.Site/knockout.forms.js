///#source 1 1 knockout.forms.core.js
// knockout.forms.core
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="frameworks/knockout-2.2.1.debug.js"/>

(function () {
    "use strict";

    if (typeof ko === "undefined") {
        throw {
            "name": "DependencyException",
            "message": "KnockoutJS is required. Please reference it before referencing this library."
        };
    }

    var forms = {};

    (function () {
        forms.localisation = {
            "strings": {
                "requiredRuleFailed": "An entry is required."
            }
        };
    });


    (function () {
        var
            entryValueRead = function () {
                var formatter = this.validation.converter.formatter;
                return formatter(this());
            },
            entryValueWrite = function (value) {
                var parser = this.validation.converter.parser,
                    parsedValue;
                
                if (typeof value === "undefined") {
                    value = "";
                }

                parsedValue = parser(value);
                
                if (parsedValue === undefined) {
                    this.entryValueFailedToParse(true);
                    return;
                }

                this(parsedValue);
            },
            valid = function () {
                var index,
                    result,
                    rule,
                    validation = this.validation,
                    value;

                if (this.entryValueFailedToParse) {
                    return false;
                }

                value = this();

                for (index = 0; index < validation.rules.length; index++) {
                    rule = validation.rules[index];
                    result = rule.validate(value);

                    if (!result.valid) {
                        validation.message(result.message);
                        return false;
                    }
                }

                validation.message("");
                return true;
            };

        ko.validatableObservable = function (value, options) {
            var observable = (ko.utils.isObservable(value)) ? value : ko.observable(value);

            observable.validation = {
                "applicable": ko.observable(true),
                "context": forms.defaultValidationContext,
                "converter": forms.passThroughConverter,
                "entryValueFailedToParse": ko.observable(false),
                "message": ko.observable(),
                "required": ko.observable(false),
                "rules": [],
                "trimEntryValue": true,
                "valid": ko.computed(valid, observable)
            };

            ko.utils.extend(observable, ko.validatableObservable.fn);
            ko.utils.extend(observable, options);

            observable.validation.entryValue = ko.computed({
                "read": entryValueRead,
                "write": entryValueWrite,
                "owner": observable
            });

            return observable;
        };

        ko.validatableObservable.fn = {
            "inapplicable": function () {
                this.applicable(false);
            },
            "noTrim": function () {
                this.trimEntryValue = false;
                return this;
            },
            "required": function () {
                this.entryRequired = true;
                return this;
            }
        };
    });


    (function () {
        forms.ValidationContext = function (options) {
            this.showSubmissionErrors = ko.observable(false);

            ko.utils.extend(this, options);
        };

        forms.defaultValidationContext = new forms.ValidationContext();
    })();


    (function () {
        forms.ValidationRule = function () {
        };
    });


    ko.forms = forms;
})();
///#source 1 1 knockout.forms.validators.js
// knockout.forms.validators
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="knockout.forms.core.js"/>

(function () {
    "use strict";

    var validators = {};

    ko.forms.validators = validators;
})();
