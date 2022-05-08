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
    .then(() => this.contacts)
    .catch(err => console.error(err));
  }

  createContact(contact) {
    return fetch('/contacts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(contact)})
    .then(response => response.json())
    .then(contact => contact)
    .catch(err => console.error(err));
  }

  updateContact(contact) {
    return fetch(`/contacts/update/${contact._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(contact)})
    .then(response => console.log(response.status))
    .catch(err => console.error(err));
  }

  deleteContact(id) {
    return fetch(`/contacts/${id}`, {
      method: 'DELETE'})
    .then(response => console.log(response.status))
    .catch(err => console.error(err));
  }
}

export default Model;