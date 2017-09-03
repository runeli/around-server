import * as express from 'express';
import apiRoute from './ApiRoute';
import {initializeFixtures} from './ApiRoute';
import {AroundMessage, AroundThread} from './AroundMessage';
import * as http from 'http';
import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';
import {AroundStoreSinleton, AroundStore} from './AroundStore';
import * as bodyParser from 'body-parser';

//For some reason typescript fails to detect "set" typing on response interface
interface ISettableResponse extends Response {
    set(headerName: string, headerValue: string): void;
}

export class AroundServer {
    aroundMessageStore: AroundStore;
    server: net.Server;
    private readonly port: number = process.env.PORT || 443;
    public app: express.Express;

    constructor() {
        this.app = express();
        this.app.disable('etag');
        this.app.use(bodyParser.json());
        this.initializeRoutes();
        this.createServer();
        this.listen();
        this.aroundMessageStore = AroundStoreSinleton;
        initializeFixtures();

    }

    private initializeRoutes(): void {
        this.app.use(this.allowCors as any);
        this.app.use("/api", apiRoute);
    }
 
    private allowCors(req: Request, res: express.Response, next: express.NextFunction) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Started Around server on port: %s', this.port);
        });
    }

    private removeAroundMessage(jsonAroundMessage: any) {

    }

    private addAroundMessage(jsonAroundMessage: AroundMessage): void {        

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

    private parseThreadId(obj:any) {
        return obj.threadId;
    }
}