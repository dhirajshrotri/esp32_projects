import path from 'path';
import express, { Application } from 'express';
import WebSocket, { Server } from 'ws';

const WS_PORT: number = 8888;
const HTTP_PORT: number = 8000;
const app: Application = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
let wsServer: Server = new WebSocket.Server({port: WS_PORT}, () => {
    console.log(`WS Server is listening at port: ${WS_PORT}`);
});

//declare an array to store connected clients upon connection
let connectedClients: Array<WebSocket> = [];

//listen to any client connecting to the server
wsServer.on('connection' , (ws, req) => {
    console.log(">>> device connected!");
    connectedClients.push(ws);

    ws.on('message', data => {
        connectedClients.forEach((ws, i)=> {
            if(ws.readyState === ws.OPEN) {
                ws.send(data);
            }
            else {
                connectedClients.splice(1, i);
            }
        });
    });
});

app.get('/client', (req, res) => {
    res.render("client");
});

app.listen(HTTP_PORT, () => {
    console.log(`HTTP server is listening on port: ${HTTP_PORT}`)
})