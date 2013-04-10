(function () {
    module("namespaces");

    test("ko.validation exists", function () {
        ok(typeof ko.validation === "object");
    });
})();


(function () {
    module("ko.validatableObservable");

    test("created without options", function () {
        var o = ko.validatableObservable("");

        ok(o.applicable(), "observable is applicable by default");
        strictEqual(o.validationContext, ko.forms.defaultValidationContext,
            "observable uses the default validation context");
    });
})();