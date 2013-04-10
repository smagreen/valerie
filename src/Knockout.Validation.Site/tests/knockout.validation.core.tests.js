(function () {
    module("namespaces");

    test("ko.forms exists", function () {
        ok(typeof ko.forms === "object");
    });
})();


(function () {
    module("ko.forms.validatableObservable");

    test("created without options", function () {
        var o = ko.forms.validatableObservable("");

        ok(o.applicable(), "observable is applicable by default");
        strictEqual(o.validationContext, ko.forms.defaultValidationContext,
            "observable uses the default validation context");
    });
})();
