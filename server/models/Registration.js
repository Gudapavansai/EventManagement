const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['registered', 'cancelled'],
        default: 'registered'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

// Preventduplicate registration for same event by same user
RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
