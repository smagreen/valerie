(function () {
    module("valerie.namespace");

    test("valerie namespace exists", function () {
        ok(typeof valerie === "object");
    });

    test("valerie.converters namespace exists", function () {
        ok(typeof valerie.converters === "object");
    });

    test("valerie.rules namespace exists", function () {
        ok(typeof valerie.rules === "object");
    });

    test("valerie.utils namespace exists", function () {
        ok(typeof valerie.utils === "object");
    });
})();