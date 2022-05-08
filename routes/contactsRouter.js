const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');

//get all
router.get('/', async (req,res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        console.log(err, err.message)
        res.status(500).json({ message: err.message });
    }
});

//get one
router.get('/:id', async (req,res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        res.json(contact);
    } catch (err) {
        console.log(err, err.message)
        res.status(500).json({ message: err.message });
    }
});

//create one
router.post('/', async (req,res) => {
    const contact = new Contact ({
        full_name: req.body.full_name,
        email: req.body.email,
        tags: req.body.tags,
        phone_number: req.body.phone_number
    });
    try {
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (err) {
        console.log(err, err.message)
        res.status(400).json({ message: err.message} );
    }
});

//delete
router.delete('/:id', async (req,res) => {
    try {
        let result = await Contact.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (err) {
        console.log("delete error router:", err.message)
        res.status(400).json({ message: err.message} );
    }
});

//update
router.put('/update/:id', async (req,res) => {
    const contactData = { full_name: req.body.full_name,
                            phone_number: req.body.phone_number,
                            email: req.body.email,
                            tags: req.body.tags}
    console.log(contactData)
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, contactData);
        res.status(204).json();
    } catch (err) {
        console.log(err, err.message)
        res.status(400).json({ message: err.message} );
    }
});
module.exports = router