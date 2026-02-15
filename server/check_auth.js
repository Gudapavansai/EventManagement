const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Response:', data);
        // If registration is successful or user exists, try login
        login();
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

const randomNum = Math.floor(Math.random() * 10000);
req.write(JSON.stringify({
    name: 'Test User',
    email: `test${randomNum}@example.com`,
    password: 'password123'
}));
req.end();

function login() {
    console.log("Attempting Login...");
    // Implement similar login logic if needed, but for now we just wanted to see if the server responds
    // to verify connectivity and auth logic flow.
}
