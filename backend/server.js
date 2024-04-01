// Import and configure dotenv to load environment variables from a .env file
require('dotenv').config();

// Import the HTTP module for creating an HTTP server
const http = require('http');

// Import the Express application from app.js
const app = require('./app');

// Destructure error object from the console module
const { error } = require('console');

// Function to normalize a port value
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Set the port to the value of the PORT environment variable or 3000 if not defined
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Function to handle errors
const errorHandler = error => {
    // Check if the error is related to server listen
    if (error.syscall !== 'listen') {
        throw error;
    }
    // Get server address and bind it to a readable format
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    // Handle specific error codes
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADORINUSE':
            console.log(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Event listener for server errors
server.on('error', errorHandler);

// Event listener for server listening
server.on('listening', () => {
    // Get server address and bind it to a readable format
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
    // Log that the server is listening
    console.log('Listening on ' + bind);
});

// Start the server and make it listen on the specified port
server.listen(port);