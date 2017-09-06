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
            aroundStore.addAroundToExistingThread(aroundMessage);
            return aroundStore.getAroundThreadById(aroundMessage.threadId);
        }
    }

    public async getLocationData(ipAddress: string): Promise<IpAddressQueryResponse> {
        const IP_ADDRESS_API_ENDPOINT = 'http://ip-api.com/json'; 
        const response = await superagent.get(IP_ADDRESS_API_ENDPOINT);
        return response.body as IpAddressQueryResponse;
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
export {IpAddressQueryResponse};
export default new AroundService();