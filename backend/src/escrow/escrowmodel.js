const mongoose = require('mongoose');

const Escrow = new mongoose.Schema({
    creator: String,
    receiver: String,
    condition: String,
    conditionSolution: String,
    amount: Number,
    escrowid: String,
    txid: String,
    status: Boolean,
    sequence: Number,
    nodeid: String,
    past: Boolean
});

const escrow = mongoose.model('Escrow', Escrow);

module.exports = escrow;