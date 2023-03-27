const mongoose = require('mongoose');

const EscMod = new mongoose.Schema({
    creator: String,
    name: String,
    model: Object

});

const escmod = mongoose.model('EscMod', EscMod);

module.exports = escmod;