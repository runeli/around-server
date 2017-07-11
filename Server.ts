import * as express from 'express';
import {ApiRoute} from './ApiRoute';
import {AroundMessage, AroundThread} from './AroundMessage';
import * as http from 'http';
import * as net from 'net';
import * as socketIo from "socket.io";
import * as fs from 'fs';
import * as path from 'path';
import {AroundStoreSinleton, AroundStore} from './AroundStore';

const CLIENT_TO_SERVER_MESSAGE = 'clientToServerMessage';
const SERVER_TO_CLIENT_MESSAGE = 'aroundToClientMessage';
const INITIAL_AROUNDS = 'initialArounds';

enum CommunicationEvents {
    INITIAL_AROUNDS = "initialArounds",
    ADD_AROUND_MESSAGE = "addAroundMessage",
    REMOVE_THREAD = "removeThread",
    REMOVE_AROUND_MESSAGE = "removeMessageFromThread",
    VOTE_THREAD_UP = "voteThreadUp",
    VOTE_THREAD_DOWN = "voteThreadUp",
    GET_NEARBY_THREADS = "getNearbyThreads"
}

export class AroundServer {
    aroundMessageStore: AroundStore;
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
        this.aroundMessageStore = AroundStoreSinleton;
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
            this.bindSocketEventHandlers(socket);
            socket.on('disconnect', () => {
                this.printInfo("disconnected " + socket.id);
            });
        });
    }

    private bindSocketEventHandlers(socket: SocketIO.Socket): void {
        this.emitInitialArounds(socket);
        socket.on(CommunicationEvents.ADD_AROUND_MESSAGE, this.addAroundMessage.bind(this, socket));
        socket.on(CommunicationEvents.REMOVE_AROUND_MESSAGE, this.removeAroundMessage.bind(this, socket));
        socket.on(CommunicationEvents.REMOVE_THREAD, this.removeThread.bind(this, socket));
    }

    private emitInitialArounds(socket: SocketIO.Socket) {
        socket.emit(CommunicationEvents.INITIAL_AROUNDS, this.aroundMessageStore.getAroundThreads());
    }

    private removeAroundMessage(socket: SocketIO.Socket, jsonAroundMessage: any) {
        try {
            const aroundMessage = AroundMessage.fromJsonLike(jsonAroundMessage, this.aroundMessageStore.getUniqueMessageId());
            this.aroundMessageStore.removeMessage(aroundMessage);
        } catch (e) {
            console.log(e);
        }
    }

    private removeThread(socket: SocketIO.Socket, jsonThreadId: string) {
        try {
            this.aroundMessageStore.removeAroundThread(this.parseThreadId(jsonThreadId));
        } catch (e) {
            console.log(e);
        }
    }

    private addAroundMessage(socket: SocketIO.Socket, jsonAroundMessage: AroundMessage): void {        
        try {
            const aroundMessage = AroundMessage.fromJsonLike(jsonAroundMessage, this.aroundMessageStore.getUniqueMessageId());
            if(!aroundMessage.threadId) {
                this.aroundMessageStore.createThread(this.createAroundThread(aroundMessage));
            } else {
                this.aroundMessageStore.addAroundToExistingThread(aroundMessage);
            }
            socket.broadcast.emit(CommunicationEvents.ADD_AROUND_MESSAGE, aroundMessage);
        } catch (e) {
            console.log(e);
        }

    }

    private createAroundThread(initialAroundMessage: AroundMessage): AroundThread {
        let threadId;
        if(!initialAroundMessage.threadId) {
            threadId = this.aroundMessageStore.generateUniqueThreadId();
        } else {
            threadId = initialAroundMessage.threadId;
        }
        const date = new Date();
        const aroundMessages: AroundMessage[] = [initialAroundMessage];
        return {
            threadId,
            date,
            aroundMessages,
            location: initialAroundMessage.location
        }
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private printInfo(msg: string): void {
        console.log(`Clients: [${Object.keys(this.io.sockets.connected).length}], ${msg}`);
    }

    private parseThreadId(obj:any) {
        return obj.threadId;
    }
}