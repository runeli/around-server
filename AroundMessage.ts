export interface AroundMessageLocation {
    lat: number;
    lng: number;
}

export interface AroundThread {
    threadId: string;
    date: Date;
    location: AroundMessageLocation;
    aroundMessages: AroundMessage[];
}

export class AroundMessage {
    messageBody: string;
    location: AroundMessageLocation;
    messageId: string;
    date: Date;
    threadId: string;

    public static fromJson(obj: AroundMessage, messageId: string): AroundMessage {
        let aroundMessage = new AroundMessage();
        aroundMessage.date = new Date(obj.date);
        aroundMessage.location = obj.location;
        aroundMessage.messageBody = obj.messageBody ? obj.messageBody : "";
        aroundMessage.messageId = messageId;
        aroundMessage.threadId = obj.threadId;
        return aroundMessage;
    }
    
    public toString(): string {
        return this.messageId;
    }
}