function RunSample() {
    function Contact() {
        var self = valerie.validatableModel({
            "firstName": ko.observable()
                .validate()
                .string()
                .name("First Name")
                .required()
                .end(),
            "surname": ko.observable()
                .validate()
                .string()
                .name("Surname")
                .end(),
            "number": ko.observable()
                .validate()
                .name("Number")
                .required()
                .expression(/^\d{11}$/)
                .ruleMessage("11 digits required.")
                .end()
        })
            .name("Contact")
            .validateChildProperties()
            .end();

        return self;
    }

    function ViewModel() {
        var contacts = ko.observableArray()
                .validateAsModel()
                .name("Contacts")
                .end(),
            contactsPropertyValidationState = contacts.propertyValidationState()
                .name("Contacts")
                .numberOfItems(2, 5)
                .ruleMessage("At least two contacts are required. Up to 5 can be added."),
            self = valerie.validatableModel({
                "listName": ko.observable()
                    .validate()
                    .string()
                    .name("List Name")
                    .required()
                    .minimumLength(5)
                    .end(),
                "contacts": contacts,
                "addContact": function () {
                    var contact = new Contact();
                    contacts.validation().startValidatingSubModel(contact);
                    contacts.push(contact);
                },
                "removeContact": function (contact) {
                    contacts.validation().stopValidatingSubModel(contact);
                    contacts.remove(contact);
                },
                "submit": function () {
                    self.validation().touched(true);
                    self.validation().updateSummary(true);
                },
                "reset": function () {
                    self.validation().touched(false);
                    self.validation().clearSummary(true);
                }
            })
                .validateChildPropertiesAndSubModels()
                .addValidationStates(contactsPropertyValidationState)
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