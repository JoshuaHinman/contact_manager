class Model {
  constructor() {
    this.contacts;
  }

  getAllContacts() {
    return fetch('/contacts')
    .then(response => response.json())
    .then(json => {
        this.contacts = json.map((contact) => {
        if (contact.tags) {
          contact.tags = contact.tags.split(',');
       } else {
         contact.tags = [];
       }
        console.log(contact.tags)
        return contact;
      })
    })
    .then(() => this.contacts);
  }

  createContact(contact) {
    return fetch('/contacts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(contact)})
    .then(response => response.json())
    .then(contact => contact);
  }

  updateContact(contact) {
    fetch(`/contacts/update/${contact._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(contact)})
    .then(response => console.log(response.status));
  }

  deleteContact(id) {
    fetch(`/contacts/${id}`, {
      method: 'DELETE'})
    .then(response => console.log(response.status));
  }
}

export default Model;