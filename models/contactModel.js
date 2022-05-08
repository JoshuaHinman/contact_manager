const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        default: ""
    },
    tags:  {
        type: String,
        required: false,
        default: ""
    },
    phone_number: {
        type: String,
        required: false,
        default: ""
    }
});

module.exports = mongoose.model('Contact', contactSchema);