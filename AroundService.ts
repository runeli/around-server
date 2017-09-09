import {AroundStoreSinleton as aroundStore} from './AroundStore';
import {AroundMessage, AroundThread} from './AroundMessage';
import * as superagent from 'superagent';

interface IpAddressQueryResponse {
    status: string,
    country: string,
    countryCode: string,
    region: string,
    regionName: string,
    city: string,
    zip: string,
    lat: number,
    lon: number,
    timezone: string,
    isp: string,
    org: string,
    as: string,
    query: string
}

class AroundService {

    public createNewThreadOrInsertToExisting(aroundMessage: AroundMessage): AroundThread {
        if(!aroundMessage.threadId) {
            return this.createNewThreadWithAroundMessage(aroundMessage);
        } else {
            aroundStore.addAroundToExistingThread(this.addUniqueMessageIdToMessageIfThereIsNone(aroundMessage));
            return aroundStore.getAroundThreadById(aroundMessage.threadId);
        }
    }

    public async getLocationData(ipAddress: string): Promise<IpAddressQueryResponse> {
        const IP_ADDRESS_API_ENDPOINT = 'http://ip-api.com/json'; 
        if(ipAddress.startsWith('192.168')) {
            ipAddress = '8.8.8.8'; //for testing
        }
        const response = await superagent.get(`${IP_ADDRESS_API_ENDPOINT}/${ipAddress}`);
        return response.body as IpAddressQueryResponse;
    }

    private createNewThreadWithAroundMessage(aroundMessage: AroundMessage): AroundThread {
        const aroundThread: AroundThread = {
            threadId: aroundStore.generateUniqueThreadId(),
            date: new Date(),
            aroundMessages: [this.addUniqueMessageIdToMessageIfThereIsNone(aroundMessage)],
            location: aroundMessage.location
        };
        if(!aroundThread.location) {
            aroundThread.location = {lng: 24.9410248, lat:60.1733244};
        }
        aroundStore.createThread(aroundThread);
        return aroundThread;
    }

    private addUniqueMessageIdToMessageIfThereIsNone(aroundMessage: AroundMessage) {
        if(!aroundMessage.messageId) {
            aroundMessage.messageId = aroundStore.getUniqueMessageId();
        }
        return aroundMessage;
    }

}
export {IpAddressQueryResponse};
export default new AroundService();