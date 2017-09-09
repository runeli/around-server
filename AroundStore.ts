import {AroundMessage, AroundMessageLocation, AroundThread} from './AroundMessage';
import * as uuid from 'uuid';

export class AroundStore {
    private aroundThreads: AroundThread[] = [];
    private messageCount = 0;

    clearDatabase() {
        this.aroundThreads = [];
        this.messageCount = 0;
        console.log(`Cleared database.`);
    }

    isMessageValid(message: AroundMessage): boolean {
        return this.isMessageBodyValid(message) && this.isAroundMessageLocationValid(message);
    }

    getUniqueMessageId(): string {        
        return uuid.v4();
    }

    generateUniqueThreadId(): string {
        return uuid.v4();
    }

    threadIdExists(threadId: string): boolean {
        return this.aroundThreads.some(thread => thread.threadId == threadId);
    }

    createThread(aroundThread: AroundThread) {
        this.aroundThreads.push(aroundThread);
        this.messageCount = this.messageCount + aroundThread.aroundMessages.length;
        console.log(`Created thread with threadId: ${aroundThread.threadId}`);
    }

    addAroundToExistingThread(aroundMessage: AroundMessage): void {
        if(aroundMessage.threadId) {
            const aroundThread = this.getAroundThreadById(aroundMessage.threadId);
            aroundThread.aroundMessages.push(aroundMessage);
            this.messageCount++;
            console.log(`Added around to thread threadId: ${aroundMessage.threadId}, aroundMessageId ${aroundMessage.messageId}`);
        }
    }

    removeMessage(aroundMessage: AroundMessage) {        
        const aroundThread = this.getAroundThreadById(aroundMessage.threadId);
        const indexToDelete = aroundThread.aroundMessages.findIndex(message => message.messageId == aroundMessage.messageId);
        aroundThread.aroundMessages.splice(indexToDelete, 1);
        this.messageCount--;
        console.log(`Removed message from threadId: ${aroundThread.threadId}, aroundMessageId ${aroundMessage.messageId}`);
    }

    removeAroundThread(threadId: string) {
        const maybeAroundThreadIndex = this.aroundThreads.findIndex(thread => thread.threadId == threadId);
        if(maybeAroundThreadIndex) {
            this.messageCount = this.messageCount - this.getAroundThreadById(threadId).aroundMessages.length;                                
            console.log(`Remove around thread threadId ${threadId}`);
        }
        
    }

    getAroundThreads() {
        return this.aroundThreads;
    }

    public getAroundThreadById(threadId: string | null): AroundThread {
        const maybeAroundThread = this.aroundThreads.find(thread => thread.threadId == threadId);
        if(maybeAroundThread) {
            return maybeAroundThread;
        } else {
            throw new Error(`Tried to operate on non-existing thread. ThreadId ${threadId}`);
        }
    }

    private isAroundMessageLocationValid(message: AroundMessage) : boolean {
        /*
        The valid range of latitude in degrees is -90 and +90 for the southern and northern hemisphere respectively. 
        Longitude is in the range -180 and +180 specifying coordinates west and east of the Prime Meridian, respectively.
        */
        if(message.location.lat < -90 || message.location.lat > 90) {            
            return false;
        }
        if(message.location.lng < -180 || message.location.lat > 180) {
            return false;
        }
        return true;
    }

    private isMessageBodyValid(message: AroundMessage): boolean {
        if(message.messageBody.length > 240) {
            console.warn(`${message}: message body length exceeds 240 character limit`);
            return false;
        }
        if(message.messageBody.length === 0) {
            console.warn(`${message}: message body is zero`);
            return false;
        }
        return true;
    }
}
export const AroundStoreSinleton = new AroundStore();