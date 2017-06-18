System.register("ApiRoute", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ApiRoute;
    return {
        setters: [],
        execute: function () {
            ApiRoute = (function () {
                function ApiRoute(route, router) {
                    this.route = route;
                    this.router = router;
                    this.initializeRoutes();
                }
                ApiRoute.create = function (route, router) {
                    new this(route, router);
                };
                ApiRoute.prototype.initializeRoutes = function () {
                    this.router.get(this.route + "/test", function (req, res, next) {
                        res.json({ "prop": "value" });
                    });
                };
                return ApiRoute;
            }());
            exports_1("ApiRoute", ApiRoute);
        }
    };
});
System.register("AroundMessage", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var AroundMessage;
    return {
        setters: [],
        execute: function () {
            AroundMessage = (function () {
                function AroundMessage() {
                }
                AroundMessage.fromJsonLike = function (obj) {
                    var aroundMessage = obj;
                    aroundMessage.date = new Date(obj.date);
                    return aroundMessage;
                };
                return AroundMessage;
            }());
            exports_2("AroundMessage", AroundMessage);
        }
    };
});
System.register("AroundStore", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var AroundStore;
    return {
        setters: [],
        execute: function () {
            AroundStore = (function () {
                function AroundStore() {
                    this.messages = [];
                }
                AroundStore.prototype.add = function (message) {
                    this.messages.push(message);
                };
                AroundStore.prototype.cleanAll = function () {
                    this.messages = [];
                };
                AroundStore.prototype.get = function (count) {
                    if (count) {
                        return this.messages.splice(count);
                    }
                    else {
                        return this.messages;
                    }
                };
                return AroundStore;
            }());
            exports_3("default", AroundStore);
        }
    };
});
System.register("Server", ["express", "ApiRoute", "AroundMessage", "https", "socket.io", "fs", "path", "AroundStore"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var express, ApiRoute_1, AroundMessage_1, https, socketIo, fs, path, AroundStore_1, CLIENT_TO_SERVER_MESSAGE, SERVER_TO_CLIENT_MESSAGE, INITIAL_AROUNDS, AroundServer;
    return {
        setters: [
            function (express_1) {
                express = express_1;
            },
            function (ApiRoute_1_1) {
                ApiRoute_1 = ApiRoute_1_1;
            },
            function (AroundMessage_1_1) {
                AroundMessage_1 = AroundMessage_1_1;
            },
            function (https_1) {
                https = https_1;
            },
            function (socketIo_1) {
                socketIo = socketIo_1;
            },
            function (fs_1) {
                fs = fs_1;
            },
            function (path_1) {
                path = path_1;
            },
            function (AroundStore_1_1) {
                AroundStore_1 = AroundStore_1_1;
            }
        ],
        execute: function () {
            CLIENT_TO_SERVER_MESSAGE = 'clientToServerMessage';
            SERVER_TO_CLIENT_MESSAGE = 'aroundToClientMessage';
            INITIAL_AROUNDS = 'initialArounds';
            AroundServer = (function () {
                function AroundServer() {
                    this.port = 8080;
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
                    console.log(path.resolve(__dirname, './key.pem'));
                    var httpsOptions = {
                        key: fs.readFileSync(path.resolve(__dirname, './key.pem')),
                        cert: fs.readFileSync(path.resolve(__dirname, './key.pem'))
                    };
                    this.server = https.createServer(httpsOptions, this.app);
                };
                AroundServer.prototype.listen = function () {
                    var _this = this;
                    this.server.listen(this.port, function () {
                        console.log('Started Around server on port: %s', _this.port);
                    });
                    this.io.on('connect', function (socket) {
                        console.log('Connected client on port %s.', _this.port);
                        _this.io.emit(INITIAL_AROUNDS, _this.aroundMessageStore.get());
                        socket.on(CLIENT_TO_SERVER_MESSAGE, function (message) {
                            _this.aroundMessageStore.add(message);
                            _this.io.emit(SERVER_TO_CLIENT_MESSAGE, AroundMessage_1.AroundMessage.fromJsonLike(message));
                        });
                        socket.on('disconnect', function () {
                            console.log('Client disconnected');
                        });
                    });
                };
                AroundServer.prototype.sockets = function () {
                    this.io = socketIo(this.server);
                };
                return AroundServer;
            }());
            exports_4("AroundServer", AroundServer);
        }
    };
});
System.register("index", ["Server"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Server_1;
    return {
        setters: [
            function (Server_1_1) {
                Server_1 = Server_1_1;
            }
        ],
        execute: function () {
            new Server_1.AroundServer();
        }
    };
});
