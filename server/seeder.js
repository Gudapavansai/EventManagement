const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const users = require('./data/users');
const events = require('./data/events');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();
        await Registration.deleteMany();

        const createdUsers = await User.insertMany(users);

        const adminUser = createdUsers[0]._id;

        // Attach first user as the organizer for all events for now
        const sampleEvents = events.map((event) => {
            return { ...event, organizer: adminUser }; // Use a real user ID later
        });

        await Event.insertMany(sampleEvents);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();
        await Registration.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
