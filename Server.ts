import * as express from 'express';
import {ApiRoute} from './ApiRoute';
import {AroundMessage} from './AroundMessage';
import * as http from 'https';
import * as net from 'net';
import * as socketIo from "socket.io";
import * as fs from 'fs';
import * as path from 'path';
import AroundMessageStore from './AroundStore';

const CLIENT_TO_SERVER_MESSAGE = 'clientToServerMessage';
const SERVER_TO_CLIENT_MESSAGE = 'aroundToClientMessage';
const INITIAL_AROUNDS = 'initialArounds';

export class AroundServer {
    aroundMessageStore: AroundMessageStore;
    io: SocketIO.Server;
    server: net.Server;
    private readonly port: number = process.env.PORT || 443;
    public app: express.Express;

    constructor() {
        this.app = express();
        this.initializeRoutes();
        this.createServer();
        this.sockets();
        this.listen();
        this.aroundMessageStore = new AroundMessageStore();
    }

    private initializeRoutes(): void {
        const router: express.Router = express.Router();
        ApiRoute.create("/api", router);
        this.app.use(router);
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Started Around server on port: %s', this.port);
        });

        this.io.on('connect', (socket: SocketIO.Socket) => {
            this.printInfo("connected " + socket.id);
            socket.emit(INITIAL_AROUNDS, this.aroundMessageStore.get());
            socket.on(CLIENT_TO_SERVER_MESSAGE, (_message: AroundMessage) => {
                let message = AroundMessage.fromJsonLike(_message, this.aroundMessageStore.getUniqueMessageId());                
                if(!this.aroundMessageStore.isMessageValid(message)) {                    
                    return;
                }
                this.printInfo('emitted ' + message.id.messageId);
                this.aroundMessageStore.add(message);
                socket.broadcast.emit(SERVER_TO_CLIENT_MESSAGE, message);
            });
            socket.on('disconnect', () => {
                this.printInfo("disconnected" + socket.id);
            });
        });
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private printInfo(msg: string): void {
        console.log(`Clients: [${Object.keys(this.io.sockets.connected).length}], ${msg}`);
    }
}