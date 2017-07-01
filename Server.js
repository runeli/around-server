"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const ApiRoute_1 = require("./ApiRoute");
const AroundMessage_1 = require("./AroundMessage");
const http = require("http");
const socketIo = require("socket.io");
const AroundStore_1 = require("./AroundStore");
const CLIENT_TO_SERVER_MESSAGE = 'clientToServerMessage';
const SERVER_TO_CLIENT_MESSAGE = 'aroundToClientMessage';
const INITIAL_AROUNDS = 'initialArounds';
var CommunicationEvents;
(function (CommunicationEvents) {
    CommunicationEvents["ADD_AROUND_MESSAGE"] = "addAroundMessage";
    CommunicationEvents["REMOVE_THREAD"] = "removeThread";
    CommunicationEvents["REMOVE_AROUND_MESSAGE"] = "removeMessageFromThread";
    CommunicationEvents["VOTE_THREAD_UP"] = "voteThreadUp";
    CommunicationEvents["VOTE_THREAD_DOWN"] = "voteThreadUp";
    CommunicationEvents["GET_NEARBY_THREADS"] = "getNearbyThreads";
})(CommunicationEvents || (CommunicationEvents = {}));
class AroundServer {
    constructor() {
        this.port = process.env.PORT || 443;
        this.app = express();
        this.initializeRoutes();
        this.createServer();
        this.sockets();
        this.listen();
        this.aroundMessageStore = new AroundStore_1.default();
    }
    initializeRoutes() {
        const router = express.Router();
        ApiRoute_1.ApiRoute.create("/api", router);
        this.app.use(router);
    }
    createServer() {
        this.server = http.createServer(this.app);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Started Around server on port: %s', this.port);
        });
        this.io.on('connect', (socket) => {
            this.printInfo("connected " + socket.id);
            this.bindSocketEventHandlers(socket);
            socket.on('disconnect', () => {
                this.printInfo("disconnected" + socket.id);
            });
        });
    }
    bindSocketEventHandlers(socket) {
        socket.on(CommunicationEvents.ADD_AROUND_MESSAGE, this.addAroundMessage.bind(this));
        socket.on(CommunicationEvents.REMOVE_AROUND_MESSAGE, this.removeAroundMessage.bind(this));
        socket.on(CommunicationEvents.REMOVE_THREAD, this.removeThread.bind(this));
    }
    removeAroundMessage(jsonAroundMessage) {
        try {
            const aroundMessage = AroundMessage_1.AroundMessage.fromJsonLike(jsonAroundMessage, this.aroundMessageStore.getUniqueMessageId());
            this.aroundMessageStore.removeMessage(aroundMessage);
        }
        catch (e) {
            console.log(e);
        }
    }
    removeThread(jsonThreadId) {
        try {
            this.aroundMessageStore.removeAroundThread(this.parseThreadId(jsonThreadId));
        }
        catch (e) {
            console.log(e);
        }
    }
    addAroundMessage(jsonAroundMessage) {
        try {
            const aroundMessage = AroundMessage_1.AroundMessage.fromJsonLike(jsonAroundMessage, this.aroundMessageStore.getUniqueMessageId());
            if (!aroundMessage.threadId) {
                this.aroundMessageStore.createThread(this.createAroundThread(aroundMessage));
            }
            else {
                this.aroundMessageStore.addAroundToExistingThread(aroundMessage);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    createAroundThread(initialAroundMessage) {
        let threadId;
        if (!initialAroundMessage.threadId) {
            threadId = this.aroundMessageStore.generateUniqueThreadId();
        }
        else {
            threadId = initialAroundMessage.threadId;
        }
        const date = new Date();
        const aroundMessages = [initialAroundMessage];
        return {
            threadId,
            date,
            aroundMessages,
            location: initialAroundMessage.location
        };
    }
    sockets() {
        this.io = socketIo(this.server);
    }
    printInfo(msg) {
        console.log(`Clients: [${Object.keys(this.io.sockets.connected).length}], ${msg}`);
    }
    parseThreadId(obj) {
        return obj.threadId;
    }
}
exports.AroundServer = AroundServer;
