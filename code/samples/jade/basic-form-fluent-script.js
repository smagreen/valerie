function RunSample() {
    var viewModel = valerie.validatableModel({
        "firstName": ko.observable()
            .validate()
            .string()
            .minimumLength(2)
            .required()
            .end(),
        "surname": ko.observable()
            .validate()
            .string()
            .minimumLength(2)
            .required()
            .end(),
        "submit": function () {
            viewModel.validation().touched(true);
        },
        "reset": function () {
            viewModel.firstName("");
            viewModel.surname("");
            viewModel.validation().touched(false);
        }
    })
        .validateAll()
        .end();

    ko.bindingHandlers.validationCss.classNames.failed = "error";
    ko.bindingHandlers.validationCss.classNames.passed = "success";

    ko.applyBindings(viewModel, document.getElementById("sample"));

    return viewModel;
};