const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('index.html', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
    console.log('WebSocket connection established');

    socket.on('message', (message) => {
        console.log('Received message:', message);
        
        // Handle the received message and send a response if needed
        // For example, you can broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});
