import { NextFunction, Request, Response, Router } from "express";

export class ApiRoute  {    
    router: Router;
    route: string;
    public static create(route: string, router: Router) {
        new this(route, router);
    }

    constructor(route: string, router: Router) {
        this.route = route;
        this.router = router;
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get(this.route + "/test", (req: Request, res: Response, next: NextFunction) => {
            res.json({"prop":"value"});
        })
    }
}