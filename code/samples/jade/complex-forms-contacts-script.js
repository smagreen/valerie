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
                .ruleMessage("Digits only.")
                .end()
        })
            .name("Contact")
            .validateChildProperties()
            .end();

        return self;
    }

    function ContactList() {
        var self = valerie.validatableModel({
            "contacts": ko.observableArray()
                .validate()
                .name("Contacts")
                .minimumNumberOfItems(2)
                .ruleMessage("At least two contacts are required.")
                .end(),
            "addContact": function () {
                var contact = new Contact();
                self.validation().startValidatingSubModel(contact);
                self.contacts.push(contact);
            },
            "removeContact": function (contact) {
                self.validation().stopValidatingSubModel(contact);
                self.contacts.remove(contact);
            }
        })
            .name("Contact List")
            .validateChildPropertiesAndSubModels()
            .end();

        return self;
    }

    var viewModel = valerie.validatableModel({
        "listName": ko.observable()
            .validate()
            .string()
            .name("List Name")
            .required()
            .minimumLength(5)
            .end(),
        "contactList": new ContactList(),
        "submit": function () {
            viewModel.validation().touched(true);
            viewModel.validation().updateSummary(true);
        },
        "reset": function () {
            viewModel.validation().touched(false);
            viewModel.validation().clearSummary(true);
        }
    })
        .validateChildPropertiesAndSubModels()
        .end();

    ko.bindingHandlers.validationCss.classNames.failed = "error";
    ko.bindingHandlers.validationCss.classNames.passed = "success";

    valerie.koBindingsHelper.useValidatingBindingHandlers();
    ko.applyBindings(viewModel, document.getElementById("sample"));

    return viewModel;
};