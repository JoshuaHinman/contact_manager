document.addEventListener('DOMContentLoaded', ()=> {
	let templates = {};
	let contactList = []; /*[{
		name: 'josh hinman',
		phone: '5037812385',
		email: "josh@mail.com",
		tags: ['friend'],
		id: 34567, 
	}];*/
	let contactsDisplay = document.getElementById('contacts-display');
	let form = document.querySelector('form');
	let search = document.getElementById('search-bar');

	function getContactIndex(id) {
		let i = 0;
		while (contactList[i].id != id) { i++; };
		return i;
	}

	function updateContact(contact) {
		let i = 0;
		while (contactList[i].id != contact.id) { i++; };

	}
	
	function compileTemplates() {
		const temps = [ ...document.querySelectorAll('[type="text/x-handlebars"]') ];
		temps.forEach( temp => templates[temp.id] = Handlebars.compile(temp.innerHTML));
	}

	function fillContactForm(contact) {
		form.dataset.id = contact.id;
		form.querySelector('[name="full_name"]').value = contact.full_name;
		form.querySelector('[name="phone_number"]').value = contact.phone_number;
		form.querySelector('[name="email"]').value = contact.email;
		form.querySelector('[name="tags"]').value = contact.tags;
	}

	function updateContactsDisplay(filter) {
		filter = filter || '';
		contactsDisplay.innerHTML = '';

		// filter by tag
		if (filter[0] === '#') {
			filter = filter.slice(1);
			contactList.forEach((contact) => {
				if(contact.tags) {
					for (let i = 0; i < contact.tags.length; i++) {
						if (contact.tags[i].match(filter)) {
							contactsDisplay.insertAdjacentHTML('beforeend', templates.contact(contact));
							break;
						}
					};
				}
			});
		} else { //filter by name or no filter
			contactList.forEach((contact) => {
				if (contact.full_name.match(filter)) {
					contactsDisplay.insertAdjacentHTML('beforeend', templates.contact(contact));
				}
			});
		}
	}

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		let contactData = {};
		let data = new FormData(form);
		console.log(data.tags)
		console.log(data.entries()[0])
		for (let pair of data) {
			contactData[pair[0]] = pair[1];
		}
		if (contactData.tags) {
			//contactData.tags = contactData.tags.split(' ');
		}
		if (form.dataset.id) {
			contactData.id = form.dataset.id;
			let idx = getContactIndex(contactData.id);
			contactList[idx] = contactData
			form.dataset.id = '';
			updateContact(contactData);
			init();
			//updateContactsDisplay();
		} else {
			contactData.id = Math.floor(Math.random() * 100000);
			createContact(contactData);
			//contactList.push(contactData);
			//updateContactsDisplay();
			//addContact(contactData);
			init();
		}
		form.reset();
	});

	form.addEventListener('keypress', (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (document.activeElement.tagName == 'input') {
				//cycle through inputs
			}
		}
	})
	document.getElementById('cancel').addEventListener('click', (event) => {
		event.preventDefault();
		form.reset();
	});

	contactsDisplay.addEventListener('click', (event) => {
		event.preventDefault();
		let target = event.target;
		if (target.textContent == 'Edit') {
			let idx = getContactIndex(target.parentNode.id);
			fillContactForm(contactList[idx]);
		} else if (target.textContent == "Delete") {
			deleteContact(target.parentNode.id);
			init();
		} else if (target.tagName === 'A') {
			search.value = target.textContent;
			updateContactsDisplay(target.textContent);
		}
	});

	search.addEventListener('input', (event) => {
		event.preventDefault();
		updateContactsDisplay(search.value);
	});

	async function init() {
		contactList = await getAllContacts();
		updateContactsDisplay();
	}

	//MODEL functions
	async function getContact(id) {
		let contact = await fetch(`/api/contacts/${id}`);
		contact = await contact.json();
		if (contact.tags) { contact.tags = contact.tags.split(','); }
		return contact;
	}

	async function getAllContacts() {
		let contacts = await fetch('/api/contacts');
		contacts = await contacts.json();
		contacts.map((contact) => {
			console.log(contact.tags)
			if (contact.tags) { contact.tags = contact.tags.split(','); }
			return contact;
		});
		console.log(contacts);
		return contacts;
	}

	function createContact(contact) {
		contact = JSON.stringify(contact);
		fetch('/api/contacts/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json'},
			body: contact});
	}

	function updateContact(contact) {
		console.log(contact.id);
		fetch(`/api/contacts/${contact.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify(contact)})
		.then( response => console.log(response));
	}

	function deleteContact(id) {
		fetch(`/api/contacts/${id}`, {
			method: 'DELETE'})
		.then(/*delete and update page  */);
	}

	compileTemplates();
	init();
});