"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiRoute = (function () {
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
exports.ApiRoute = ApiRoute;
