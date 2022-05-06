class View {
  constructor() {
    this.templates = {};
    this.contactList = [];
    this.tags = ['friend', 'family', 'work', 'neighbor', 'school'];

    this.contactsDisplay = document.getElementById('contacts-display');
    this.form = document.querySelector('form');
    this.modal = document.querySelector('.center');
    this.search = document.getElementById('search-bar');

    this.refreshContactList = null;
    this.deleteContact = null;
    this.createContact = null;
    this.updateContact = null;

    this.compileTemplates();
    this.bindMainEventListeners();
    this.bindFormListeners();
    this.renderTagList();
  }

  //Initializing functions
  compileTemplates() {
    const temps = [ ...document.querySelectorAll('[type="text/x-handlebars"]') ];
    temps.forEach( temp => this.templates[temp.id] = Handlebars.compile(temp.innerHTML));
  }

  renderTagList() {
    let tagsEl = document.getElementById('tags');
    tagsEl.innerHTML = '';
    this.tags.forEach((tag) => {
      tagsEl.insertAdjacentHTML('beforeend', this.templates.tag({tag: tag}));
    })
  }

  bindDeleteHandler(func) {
    this.deleteContact = func;
  }

  bindRefreshHandler(func) {
    this.refreshContactList = func;
  }

  bindCreateHandler(func) {
    this.createContact = func;
  }

  bindUpdateHandler(func) {
    this.updateContact = func;
  }

  //Event Listeners
  bindMainEventListeners() {
    this.contactsDisplay.addEventListener('click', (event) => {
      event.preventDefault();
      this.contactClick(event.target);
    });

     document.querySelector('.add-contact').addEventListener('click', (event) => {
      this.showForm();
    })

    this.search.addEventListener('input', (event) => {
      event.preventDefault();
      this.updateContactsDisplay(this.search.value);
    });
  }

  contactClick(target) {
     if (target.textContent == 'Edit') {
        this.editClick(target.parentNode.id);
      } else if (target.textContent == "Delete") {
        this.deleteClick(target.parentNode.id);
      } else if (target.tagName === 'A') {
        this.tagClick(target);
      }
  }

  editClick(id) {
    let idx = this.getContactIndex(id);
    this.fillContactForm(this.contactList[idx]);
    this.showForm();
  }

  async deleteClick(id) {
    if (confirm("Delete this contact?")) {
     await  this.deleteContact(id);
      this.refreshContactList();
    }
  }

  tagClick(target) {
    this.search.value = target.textContent;
    this.updateContactsDisplay(target.textContent);
  }

  bindFormListeners() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submitForm();
    });

    document.getElementById('cancel').addEventListener('click', (event) => {
      event.preventDefault();
      this.hideAndClearForm();
    });

    this.form.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); }
    });
  }

  submitForm() {
    let contactData = this.getFormData();
    if (this.form.dataset.id) { // if editing a contact
      contactData['_id'] = this.form.dataset.id;
      this.submitEdit(contactData);
    } else {                    //if new contact
      this.submitNew(contactData);
    }

    this.hideAndClearForm();
  }

  async submitEdit (contactData) {
    await this.updateContact(contactData);
    this.form.dataset.id = '';
    let idx = this.getContactIndex(contactData._id);
    contactData.tags = contactData.tags.split(',');
    if (contactData.tags[0] == '') { contactData.tags = []; }
    this.contactList[idx] = contactData;
    this.updateContactsDisplay();
  }

  submitNew(contactData) {
    this.createContact(contactData);
    this.refreshContactList();
  }

  //DOM functions
  getFormData() {
    let data = new FormData(this.form);
    let contactData = {};
    let tagArray = [];

    this.tags.forEach((tag) => {
      if (data.has(tag)) {
        tagArray.push(tag);
        data.delete(tag);
      }
    })

    contactData['tags'] = tagArray.join(',');

    for (let pair of data) {
      contactData[pair[0]] = pair[1];
    }

    return contactData;
  }

  showForm() {
    this.modal.classList.add('show');
  }

  hideAndClearForm() {
    this.modal.classList.remove('show');
    this.form.reset();
     this.tags.forEach((tag) => {
      let checkBox = document.querySelector(`[name="${tag}"]`);
      checkBox.removeAttribute('checked');
    });
  }

  getContactIndex(id) {
    let i = 0;
    while (i < this.contactList.length && this.contactList[i]._id != id) {
      i++; }
    return i;
  }

  fillContactForm(contact) {
    this.form.dataset.id = contact._id;
    this.form.querySelector('[name="full_name"]').value = contact.full_name;
    this.form.querySelector('[name="phone_number"]').value = contact.phone_number;
    this.form.querySelector('[name="email"]').value = contact.email;
    if (contact.tags) {
      contact.tags.forEach((tag) => {
        let checkBox = document.querySelector(`[name="${tag}"]`);
        if (1) {
          checkBox.setAttribute('checked', 'checked');
        }
      });
    }
  }

  updateContactsDisplay(filter = "") {
    filter = filter.toLowerCase();
    this.contactsDisplay.innerHTML = '';
    if (this.contactList.length === 0) {
      this.renderEmptyContacts();
    } else if (filter[0] === '#') {
      this.filterByTag(filter.slice(1));
    } else {
     this.filterByWord(filter);
    }
  }

  filterByTag(filter) {
    this.contactList.forEach((contact) => {
      if(contact.tags) {
        for (let i = 0; i < contact.tags.length; i++) {
          let tag = contact.tags[i].toLowerCase();
          if (tag.match(filter)) {
            this.contactsDisplay.insertAdjacentHTML('beforeend', this.templates.contact(contact));
            break;
          }
        }
      }
    });
  }

  filterByWord(filter) {
    this.contactList.forEach((contact) => {
      let name = contact.full_name.toLowerCase();
      if (name.match(filter)) {
        this.contactsDisplay.insertAdjacentHTML('beforeend', this.templates.contact(contact));
      }
    });
  }

  renderEmptyContacts() {
    this.contactsDisplay.insertAdjacentHTML('beforeend', this.templates.emptyContacts());
  }
}

export default View;