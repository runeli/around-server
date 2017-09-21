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
    threadId: string | null;
    temporaryMessageId: string | null;

    public static fromJson(obj: AroundMessage): AroundMessage {
        let aroundMessage = new AroundMessage();
        aroundMessage.date = new Date(obj.date);
        aroundMessage.location = obj.location;
        aroundMessage.messageBody = obj.messageBody ? obj.messageBody : "";
        aroundMessage.threadId = obj.threadId;
        aroundMessage.temporaryMessageId = obj.temporaryMessageId;
        return aroundMessage;
    }
    
    public toString(): string {
        return this.messageId;
    }
}