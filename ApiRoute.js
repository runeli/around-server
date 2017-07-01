"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiRoute {
    static create(route, router) {
        new this(route, router);
    }
    constructor(route, router) {
        this.route = route;
        this.router = router;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.route + "/test", (req, res, next) => {
            res.json({ "prop": "value" });
        });
    }
}
exports.ApiRoute = ApiRoute;
