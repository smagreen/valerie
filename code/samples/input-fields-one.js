var viewModel = valerie.validatableModel({
    "firstName": ko.observable()
        .validate()
        .string()
        .required()
        .end(),
    "surname": ko.observable()
        .validate()
        .string()
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
