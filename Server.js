"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ApiRoute_1 = require("./ApiRoute");
var AroundMessage_1 = require("./AroundMessage");
var http = require("https");
var socketIo = require("socket.io");
var AroundStore_1 = require("./AroundStore");
var CLIENT_TO_SERVER_MESSAGE = 'clientToServerMessage';
var SERVER_TO_CLIENT_MESSAGE = 'aroundToClientMessage';
var INITIAL_AROUNDS = 'initialArounds';
var AroundServer = (function () {
    function AroundServer() {
        this.port = process.env.PORT || 443;
        this.app = express();
        this.initializeRoutes();
        this.createServer();
        this.sockets();
        this.listen();
        this.aroundMessageStore = new AroundStore_1.default();
    }
    AroundServer.prototype.initializeRoutes = function () {
        var router = express.Router();
        ApiRoute_1.ApiRoute.create("/api", router);
        this.app.use(router);
    };
    AroundServer.prototype.createServer = function () {
        this.server = http.createServer(this.app);
    };
    AroundServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Started Around server on port: %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            _this.printInfo("connected " + socket.id);
            socket.emit(INITIAL_AROUNDS, _this.aroundMessageStore.get());
            socket.on(CLIENT_TO_SERVER_MESSAGE, function (_message) {
                var message = AroundMessage_1.AroundMessage.fromJsonLike(_message, _this.aroundMessageStore.getUniqueMessageId());
                if (!_this.aroundMessageStore.isMessageValid(message)) {
                    return;
                }
                _this.printInfo('emitted ' + message.id.messageId);
                _this.aroundMessageStore.add(message);
                socket.broadcast.emit(SERVER_TO_CLIENT_MESSAGE, message);
            });
            socket.on('disconnect', function () {
                _this.printInfo("disconnected" + socket.id);
            });
        });
    };
    AroundServer.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    AroundServer.prototype.printInfo = function (msg) {
        console.log("Clients: [" + Object.keys(this.io.sockets.connected).length + "], " + msg);
    };
    return AroundServer;
}());
exports.AroundServer = AroundServer;
