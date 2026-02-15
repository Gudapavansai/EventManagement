const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    registrations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration'
    }]
});

module.exports = mongoose.model('Event', EventSchema);
