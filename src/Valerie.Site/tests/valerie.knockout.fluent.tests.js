(function () {
    //#region Fluent

    module("valerie.knockout.fluent.between");

    test("observable is validated between bounds (1, 10)", function () {
        var o,
            result,
            rangeFailureResult = { "failed": true, "failureMessage": "The value must be between 1 and 10." },
            requiredFailureResult = { "failed": true, "failureMessage": "A value is required." };

        o = ko.observable().validate().between(1, 10).end();

        o(undefined);
        result = o.validation().result();
        deepEqual(result, rangeFailureResult, "validation passed for required: false, value: undefined");

        o(null);
        result = o.validation().result();
        deepEqual(result, rangeFailureResult, "validation passed for required: false, value: null");

        o("");
        result = o.validation().result();
        deepEqual(result, rangeFailureResult, "validation passed for required: false, value: \"\"");

        o([]);
        result = o.validation().result();
        deepEqual(result, rangeFailureResult, "validation passed for required: false, value: []");

        o(0);
        result = o.validation().result();
        deepEqual(result, rangeFailureResult, "validation failed for required: false, value: 0");

        o(1);
        ok(o.validation().failed() === false, "validation passed for required: false, value: 1");

        o(5);
        ok(o.validation().failed() === false, "validation passed for required: false, value: 5");

        o(10);
        ok(o.validation().failed() === false, "validation passed for required: false, value: 10");

        o(11);
        result = o.validation().result();
        deepEqual(result, rangeFailureResult, "validation failed for required: false, value: 11");

        o = ko.observable().validate().required().between(1, 10).end();

        o(undefined);
        result = o.validation().result();
        deepEqual(result, requiredFailureResult, "validation failed for required: true, value: undefined");
    });

    //#region 
})();
