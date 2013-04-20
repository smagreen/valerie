(function () {
    //#region Validation

    module("valerie.knockout.validation");

    test("observable extended with validation function", function () {
        ko.observable().validation();
        ok(true);
    });

    test("observable array extended with validation function", function () {
        ko.observableArray().validation();
        ok(true);
    });

    test("computed extended with validation function", function () {
        ko.computed(function () {
        }).validation();

        ok(true);
    });

    //#endregion

    //#region Validation - Required

    module("valerie.knockout.validation.required");

    test("observable is validated against its requiredness", function () {
        var o;

        o = ko.observable().validation().end();
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


        o = ko.observable().validation().required().end();

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
