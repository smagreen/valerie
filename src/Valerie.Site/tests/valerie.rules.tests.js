(function () {
    var rules = valerie.rules;

    //#region Maximum

    module("valerie.rules.Maximum");

    test("rule without maximum never fails", function () {
        strictEqual(new rules.Maximum().test().failed, false, "maximumValueOrFunc is missing");

        strictEqual(new rules.Maximum(undefined).test().failed, false, "maximumValueOrFunc is undefined");

        strictEqual(new rules.Maximum(null).test().failed, false, "maximumValueOrFunc is undefined");

        strictEqual(new rules.Maximum(function () { return undefined; }).test().failed, false,
            "maximumValueOrFunc is a function that returns undefined");

        strictEqual(new rules.Maximum(function () { return null; }).test().failed, false,
            "maximumValueOrFunc is a function that returns null");
    });

    test("rule with maximum as primitive works", function () {
        strictEqual(new rules.Maximum(10).test(5).failed, false, "value < maximum");

        strictEqual(new rules.Maximum(10).test(10).failed, false, "value = maximum");

        strictEqual(new rules.Maximum(10).test(11).failed, true, "value > maximum");
    });

    test("rule with maximum as function works", function () {
        var maximumFunc = function () { return 10; };

        strictEqual(new rules.Maximum(maximumFunc).test(5).failed, false, "value < maximum");

        strictEqual(new rules.Maximum(maximumFunc).test(10).failed, false, "value = maximum");

        strictEqual(new rules.Maximum(maximumFunc).test(11).failed, true, "value > maximum");
    });

    test("result includes default failureMessage when rule fails", function () {
        strictEqual(new rules.Maximum(10).test(11).failedMessage, "The value must be no greater than 10.",
            "message as expected");

        rules.Maximum.defaultOptions.failedMessageFormat = "OMG! {value} > {maximum}";
        
        strictEqual(new rules.Maximum(10).test(11).failedMessage, "OMG! 11 > 10",
            "message as expected");
    });

    test("result includes overridden failureMessage when rule fails", function () {
        strictEqual(new rules.Maximum(10, { "failedMessageFormat": "{value} > {maximum}, WTH!" }).test(11).failedMessage,
            "11 > 10, WTH!", "message as expected");
    });

    //#endregion
})();
