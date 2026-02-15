const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEvent,
    createEvent,
    registerEvent,
    cancelRegistration,
    getMyEvents,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getEvents)
    .post(createEvent);

router.route('/mine').get(protect, getMyEvents);

router.route('/:id').get(getEvent);

router.route('/:id/register')
    .post(protect, registerEvent)
    .delete(protect, cancelRegistration);

module.exports = router;
