(function () {
    var utils = valerie.utils;

    //#region formatString

    module("valerie.utils.formatString");

    test("without replacements the result is the format string", function () {
        strictEqual(utils.formatString("{0} {1} {2}"), "{0} {1} {2}", "replacements not specified");

        strictEqual(utils.formatString("{0} {1} {2}", undefined), "{0} {1} {2}", "replacements is undefined");

        strictEqual(utils.formatString("{0} {1} {2}", null), "{0} {1} {2}", "replacements is null");

        strictEqual(utils.formatString("{0} {1} {2}", {}), "{0} {1} {2}", "replacements is empty object literal");

        strictEqual(utils.formatString("{0} {1} {2}", []), "{0} {1} {2}", "replacements is empty array literal");
    });

    test("replacements are made in the format string", function () {
        strictEqual(utils.formatString("{0} {1} {2}", ["alpha", "beta", "gamma"]), "alpha beta gamma",
            "array literal works");

        strictEqual(utils.formatString("{0} {1} {z}", { 0: "alpha", "1": "beta", z: "gamma" }), "alpha beta gamma",
            "object literal works");
    });

    test("replacements can be missing", function () {
        strictEqual(utils.formatString("{0} {1} {z}", ["alpha", "beta"]), "alpha beta {z}",
            "replacements is array literal");

        strictEqual(utils.formatString("{0} {1} {z}", { "z": "gamma" }), "{0} {1} gamma",
            "replacements is object literal");
    });

    //#endregion

    //#region isArray

    module("valerie.utils.isArray");
    // ToDo: Write tests.

    //#endregion

    //#region isObject

    module("valerie.utils.isObject");
    // ToDo: Write tests.

    //#endregion

    //#region mergeOptions

    module("valerie.utils.mergeOptions");

    test("without defaultOptions or options the result is {}", function () {
        deepEqual(utils.mergeOptions(), {}, "defaultOptions and options are missing");

        deepEqual(utils.mergeOptions(undefined), {}, "defaultOptions is undefined and options is missing");

        deepEqual(utils.mergeOptions(null), {}, "defaultOptions is null and options is missing");
    });

    test("without defaultOptions the result is options", function () {
        deepEqual(utils.mergeOptions(undefined, { "size": 10 }), { "size": 10 }, "defaultOptions is undefined");

        deepEqual(utils.mergeOptions(null, { "size": 10 }), { "size": 10 }, "defaultOptions is null");
    });

    test("without options the result is defaultOptions", function () {
        deepEqual(utils.mergeOptions({ "size": 10 }), { "size": 10 }, "options is missing");

        deepEqual(utils.mergeOptions({ "size": 10 }, undefined), { "size": 10 }, "options is undefined");

        deepEqual(utils.mergeOptions({ "size": 10 }, null), { "size": 10 }, "options is null");
    });

    test("defaultOptions and options are merged", function () {
        deepEqual(utils.mergeOptions({ "size": 10 }, { "weight": 10 }), { "size": 10, "weight": 10 },
            "exclusive options");

        deepEqual(utils.mergeOptions({ "size": 10 }, { "size": 20 }), { "size": 20 },
            "options overwrite defaultOptions");
    });

    //#endregion    
})();
