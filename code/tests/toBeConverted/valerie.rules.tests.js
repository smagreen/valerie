(function () {
    var rules = valerie.rules;

    //#region Range

    module("valerie.rules.Range");

    test("rule without minimum and maximum never fails", function () {
        strictEqual(new rules.Range(undefined, undefined).test().failed, false,
            "minimumValueOrFunc, maximumValueOrFunc are undefined, value parameter is missing");

        strictEqual(new rules.Range(undefined, undefined).test(undefined).failed, false,
            "minimumValueOrFunc, maximumValueOrFunc are undefined, value parameter is undefined");

        strictEqual(new rules.Range(null, null).test(null).failed, false,
            "minimumValueOrFunc, maximumValueOrFunc are null, value is null");

        strictEqual(new rules.Range(null, null).test(10).failed, false,
            "minimumValueOrFunc, maximumValueOrFunc are null, value is primitive");
    });

    test("rule with minimum as primitive works", function () {
        strictEqual(new rules.Range(5, undefined).test(10).failed, false, "value > minimum");

        strictEqual(new rules.Range(5, undefined).test(5).failed, false, "value = minimum");

        strictEqual(new rules.Range(5, undefined).test(1).failed, true, "value < minimum");
    });

    test("rule with minimum as function works", function () {
        var minimumFunc = function () { return 5; };

        strictEqual(new rules.Range(minimumFunc, undefined).test(10).failed, false, "value > minimum");

        strictEqual(new rules.Range(minimumFunc, undefined).test(5).failed, false, "value = minimum");

        strictEqual(new rules.Range(minimumFunc, undefined).test(1).failed, true, "value < minimum");
    });

    test("rule with maximum as primitive works", function () {
        strictEqual(new rules.Range(undefined, 10).test(5).failed, false, "value < maximum");

        strictEqual(new rules.Range(undefined, 10).test(10).failed, false, "value = maximum");

        strictEqual(new rules.Range(undefined, 10).test(11).failed, true, "value > maximum");
    });

    test("rule with maximum as function works", function () {
        var maximumFunc = function () { return 10; };

        strictEqual(new rules.Range(undefined, maximumFunc).test(5).failed, false, "value < maximum");

        strictEqual(new rules.Range(undefined, maximumFunc).test(10).failed, false, "value = maximum");

        strictEqual(new rules.Range(undefined, maximumFunc).test(11).failed, true, "value > maximum");
    });

    test("result includes default failure message when rule fails", function () {
        strictEqual(new rules.Range(1, 10).test(0).failureMessage, "The value must be between 1 and 10.",
            "message as expected with value < minimum < maximum ");

        strictEqual(new rules.Range(1, 10).test(11).failureMessage, "The value must be between 1 and 10.",
            "message as expected with value > maximum > minimum");

        strictEqual(new rules.Range(1, undefined).test(0).failureMessage, "The value must be no less than 1.",
            "message as expected with value < minimum");

        strictEqual(new rules.Range(undefined, 10).test(11).failureMessage, "The value must be no greater than 10.",
            "message as expected with value > maximum");
    });

    test("result includes changed default failure message when rule fails", function () {
        rules.Range.defaultOptions = {
            "failureMessageFormatForMinimumOnly": "{value} < {minimum}.",
            "failureMessageFormatForMaximumOnly": "{value} > {maximum}.",
            "failureMessageFormatForRange": "!({minimum} >= {value} <= {maximum}).",
            "valueFormatter": valerie.converters.passThrough.formatter
        };

        strictEqual(new rules.Range(1, 10).test(0).failureMessage, "!(1 >= 0 <= 10).",
            "message as expected with value < minimum < maximum ");

        strictEqual(new rules.Range(1, 10).test(11).failureMessage, "!(1 >= 11 <= 10).",
            "message as expected with value > maximum > minimum");

        strictEqual(new rules.Range(1, undefined).test(0).failureMessage, "0 < 1.",
            "message as expected with value < minimum");

        strictEqual(new rules.Range(undefined, 10).test(11).failureMessage, "11 > 10.",
            "message as expected with value > maximum");
    });

    test("result includes overridden failure messages when rule fails", function () {
        var options = {
            "failureMessageFormatForMinimumOnly": "OMG! {value} < {minimum}.",
            "failureMessageFormatForMaximumOnly": "OMG! {value} > {maximum}.",
            "failureMessageFormatForRange": "OMG! !({minimum} >= {value} <= {maximum}).",
            "valueFormatter": valerie.converters.passThrough.formatter
        };

        strictEqual(new rules.Range(1, 10, options).test(0).failureMessage, "OMG! !(1 >= 0 <= 10).",
            "message as expected with value < minimum < maximum ");

        strictEqual(new rules.Range(1, 10, options).test(11).failureMessage, "OMG! !(1 >= 11 <= 10).",
            "message as expected with value > maximum > minimum");

        strictEqual(new rules.Range(1, undefined, options).test(0).failureMessage, "OMG! 0 < 1.",
            "message as expected with value < minimum");

        strictEqual(new rules.Range(undefined, 10, options).test(11).failureMessage, "OMG! 11 > 10.",
            "message as expected with value > maximum");
    });

    //#endregion
})();
