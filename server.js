require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database"));

app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));


const contactsRouter = require('./routes/contactsRouter');
app.use('/contacts', contactsRouter);

app.get('/', (req,res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.listen(process.env.PORT || 3000, () => console.log('Listening'));
