const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const { search, category, location, date } = req.query;
    let query = {};

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }
    if (date) {
        // Filter for events on or after the specified date
        query.date = { $gte: new Date(date) };
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.status(200).json(events);
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    res.status(200).json(event);
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (or Public for now)
const createEvent = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.date) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const event = await Event.create({
        name: req.body.name,
        organizer: req.body.organizer,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        capacity: req.body.capacity,
        category: req.body.category,
    });

    res.status(201).json(event);
});

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check capacity
    const currentRegistrations = await Registration.countDocuments({ event: req.params.id });

    if (currentRegistrations >= event.capacity) {
        res.status(400);
        throw new Error('Event is at full capacity');
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
        user: req.user._id,
        event: req.params.id,
    });

    if (existingRegistration) {
        res.status(400);
        throw new Error('User already registered for this event');
    }

    // Create registration
    const registration = await Registration.create({
        user: req.user._id,
        event: req.params.id,
        status: 'registered'
    });

    res.status(201).json(registration);
});

// @desc    Cancel registration
// @route   DELETE /api/events/:id/register
// @access  Private
const cancelRegistration = asyncHandler(async (req, res) => {
    const registration = await Registration.findOneAndDelete({
        user: req.user._id,
        event: req.params.id
    });

    if (!registration) {
        res.status(404);
        throw new Error('Registration not found');
    }

    res.status(200).json({ message: 'Registration cancelled', registrationId: registration._id });
});


// @desc    Get user's registered events
// @route   GET /api/events/mine
// @access  Private
const getMyEvents = asyncHandler(async (req, res) => {
    const registrations = await Registration.find({ user: req.user._id })
        .populate('event')
        .sort({ registrationDate: -1 });
    res.status(200).json(registrations);
});

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    registerEvent,
    cancelRegistration,
    getMyEvents,
};
