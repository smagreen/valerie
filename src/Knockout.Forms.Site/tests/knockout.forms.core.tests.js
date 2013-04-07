(function () {
    module("namespaces");

    test("ko.forms exists", function () {
        ok(typeof ko.forms === "object");
    });
})();


(function () {
    module("ko.forms.Entry");

    test("created with defaults", function () {
        var entry = new ko.forms.Entry();

        ok(entry.applicable(), "entry is applicable by default");
        strictEqual(entry.validationContext, ko.forms.defaultValidationContext,
            "entry uses the default validation context");
    });
})();
