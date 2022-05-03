class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.view.bindRefreshHandler(this.refreshContactList);
		this.view.bindCreateHandler(this.createContact);
		this.view.bindUpdateHandler(this.updateContact);
		this.view.bindDeleteHandler(this.deleteContact);

		this.view.refreshContactList();
	}

	refreshContactList = async () => {
		let contacts = await this.model.getAllContacts();
		this.view.contactList = contacts;
		this.view.updateContactsDisplay();
	}

	createContact = async (contactData) => {
		let contact = await this.model.createContact(contactData);
		console.log(contact);
	}

	deleteContact = (id) => {
		this.model.deleteContact(id);
	}

	updateContact = (contact) => {
		this.model.updateContact(contact);
	}

}

export default Controller;