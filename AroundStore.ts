import {AroundMessage, AroundMessageLocation, MessageId} from './AroundMessage';



export default class AroundStore {
    
    private messages: AroundMessage[] = [];

    add(message: AroundMessage) {
        if(this.isMessageValid(message)) {
            this.messages.push(message);
        } else {
            console.warn(`Unable to add message ${message.id.messageId}. Validation errors exist`);
        }
    }

    cleanAll(): void {
        this.messages = [];
    }

    get(count?: number): AroundMessage[] {
        if(count) {
            return this.messages.splice(count);
        } else {
            return this.messages;
        }
    }

    isMessageValid(message: AroundMessage): boolean {
        if(this.isMessageBodyValid(message) && this.isAroundMessageLocationValid(message)){
            return true;
        } else {
            return false;
        }
    }

    public getUniqueMessageId(): MessageId {
        return {messageId: this.messages.length.toString()}
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