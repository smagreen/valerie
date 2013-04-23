(function () {
    //#region Validation

    module("valerie.knockout.validate");

    test("observable extended with validate function", function () {
        ko.observable().validate();
        ok(true);
    });

    test("observable array extended with validate function", function () {
        ko.observableArray().validate();
        ok(true);
    });

    test("computed extended with validate function", function () {
        ko.computed(function () {
        }).validate();

        ok(true);
    });

    //#endregion

    //#region Validation - Required

    module("valerie.knockout.validation.required");

    test("observable is validated against its requiredness", function () {
        var o;

        o = ko.observable().validate().end();
        o(undefined);
        ok(o.validation().failed() === false, "validation passed for required: false, value: undefined");

        o(null);
        ok(o.validation().failed() === false, "validation passed for required: false, value: null");

        o("");
        ok(o.validation().failed() === false, "validation passed for required: false, value: \"\"");

        o([]);
        ok(o.validation().failed() === false, "validation passed for required: false, value: []");

        o(10);
        ok(o.validation().failed() === false, "validation passed for required: false, value: 10");


        o = ko.observable().validate().required().end();

        o(undefined);
        ok(o.validation().failed(), "validation failed for required: true, value: undefined");

        o(null);
        ok(o.validation().failed(), "validation failed for required: true, value: null");

        o("");
        ok(o.validation().failed(), "validation failed for required: true, value: \"\"");

        o([]);
        ok(o.validation().failed(), "validation failed for required: true, value: []");

        o("valerie");
        ok(o.validation().failed() === false, "validation passed for required: true, value: \"valerie\"");

        o(10);
        ok(o.validation().failed() === false, "validation passed for required: true, value: 10");
    });

    //#region 
})();
