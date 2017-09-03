import { NextFunction, Request, Response, Router } from "express";
import {AroundStoreSinleton as aroundStore} from './AroundStore';
import {AroundThread, AroundMessage} from './AroundMessage';
import generateAroundMessage from './RandomAroundGenerator';
import aroundService from './AroundService';

const router = Router();

router.get('/thread/:threadId', (req: Request, res: Response) => {
    console.log("get thread by id " + req.params.threadId);
    const thread = aroundStore.getAroundThreadById(req.params.threadId);
    res.json({thread});
});

router.post('/thread', (req: Request, res: Response) => {
    const message: AroundMessage = AroundMessage.fromJson(req.body, req.body.messageId);
    const thread = aroundService.createNewThreadOrInsertToExisting(message);
    res.json(thread);
});

router.get('/threads', (req: Request, res: Response) => {
    res.json(aroundStore.getAroundThreads());
});
router.post("/initializeFixtures", (req: Request, res: Response) => {
    initializeFixtures();
    res.json({"msg":"generated threads"});
});

const initializeFixtures = (): void => {
    console.log('Initializing fixtures...');
    aroundStore.clearDatabase();
    const helsinkiLocation = {lng: 24.9410248, lat:60.1733244};
    (new Array(10)).fill(0).map(() => generateThread()).forEach(t => aroundStore.createThread(t));
}

const generateThread = (): AroundThread => {
    const helsinkiLocation = {lng: 24.9410248, lat:60.1733244};
    const threadId1 = aroundStore.generateUniqueThreadId();
    const messages = (new Array(30)).fill(0).map(() => generateAroundMessage(helsinkiLocation, threadId1));
    return {
        threadId: threadId1,
        location: helsinkiLocation,
        aroundMessages: messages,
        date: new Date()
    };
}

export default router;
export {initializeFixtures};