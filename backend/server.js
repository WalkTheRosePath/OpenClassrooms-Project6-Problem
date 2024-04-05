/**
 * Entry point for the application
 * Initializes the HTTP server, sets up error handling, 
 * and starts listening on the specified port
 */

// Import the required modules
require('dotenv').config();
const http = require('http');
const app = require('./app');

// Set the port
const port = 3000;
app.set('port', port);

// Create an HTTP server using the Express app
const server = http.createServer(app);

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
        case 'EADDRINUSE':
            console.log(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

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