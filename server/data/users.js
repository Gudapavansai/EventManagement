const bcrypt = require('bcryptjs');

// Create mock users for seeding
const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
    },
    {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
    },
];

module.exports = users;
