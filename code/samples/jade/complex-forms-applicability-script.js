function RunSample() {
    function Address() {
        var self = valerie.validatableModel({
            "street": ko.observable()
                .validate()
                .string()
                .name("Street")
                .required()
                .minimumLength(5)
                .end(),
            "town": ko.observable()
                .validate()
                .string()
                .name("Town")
                .required()
                .minimumLength(2)
                .end(),
            "postcode": ko.observable()
                .validate()
                .name("Postcode")
                .required()
                .postcode()
                .end()
        })
            .name("Contact")
            .validateChildProperties()
            .end();

        return self;
    }

    function ViewModel() {
        var shipToBillingAddress = ko.observable(false)
                .validate()
                .name("Ship to Billing Address")
                .end(),
            self = valerie.validatableModel({
                "shipToBillingAddress": shipToBillingAddress,
                "billingAddress": new Address(),
                "shippingAddress": new Address()
                    .validation()
                    .applicable(ko.computed(function () { return !shipToBillingAddress(); }))
                    .end(),
                "submit": function () {
                    self.validation().touched(true);
                    self.validation().updateSummary(true);
                }
            })
                .validateChildPropertiesAndSubModels()
                .end();

        return self;
    }

    var viewModel = new ViewModel();

    ko.bindingHandlers.validationCss.classNames.failed = "error";
    ko.bindingHandlers.validationCss.classNames.passed = "success";

    valerie.koBindingsHelper.useValidatingBindingHandlers();
    ko.applyBindings(viewModel, document.getElementById("sample"));

    return viewModel;
};