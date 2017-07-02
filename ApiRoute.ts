import { NextFunction, Request, Response, Router } from "express";
import {AroundStoreSinleton as aroundStore} from './AroundStore';
import {AroundThread} from './AroundMessage';
import generateAroundMessage from './RandomAroundGenerator';
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
        this.router.post(this.route + "/initializeFixtures", (req: Request, res: Response) => {
            aroundStore.clearDatabase();
            const helsinkiLocation = {lng: 24.9410248, lat:60.1733244};
            const threadId1 = aroundStore.generateUniqueThreadId();
            const messages = (new Array(5)).fill(0).map(() => generateAroundMessage(helsinkiLocation, threadId1));
            const thread1 = {
                    threadId: threadId1,
                    location: helsinkiLocation,
                    aroundMessages: messages,
                    date: new Date()
            };
            aroundStore.createThread(thread1);
            res.json(thread1);
        });
    }

    

}