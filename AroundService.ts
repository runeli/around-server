import {AroundStoreSinleton as aroundStore} from './AroundStore';
import {AroundMessage, AroundThread} from './AroundMessage';
class AroundService {

    public createNewThreadOrInsertToExisting(aroundMessage: AroundMessage): AroundThread {
        if(!aroundMessage.threadId) {
            return this.createNewThreadWithAroundMessage(aroundMessage);
        } else {
            aroundStore.addAroundToExistingThread(aroundMessage);
            return aroundStore.getAroundThreadById(aroundMessage.threadId);
        }
    }

    private createNewThreadWithAroundMessage(aroundMessage: AroundMessage): AroundThread {
        const aroundThread: AroundThread = {
            threadId: aroundStore.generateUniqueThreadId(),
            date: new Date(),
            aroundMessages: [aroundMessage],
            location: aroundMessage.location
        };
        aroundStore.createThread(aroundThread);
        return aroundThread;
    }

}

export default new AroundService();