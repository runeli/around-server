"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AroundMessage {
    static fromJsonLike(obj, messageId) {
        let aroundMessage = new AroundMessage();
        aroundMessage.date = new Date(obj.date);
        aroundMessage.location = obj.location;
        aroundMessage.messageBody = obj.messageBody ? obj.messageBody : "";
        aroundMessage.messageId = messageId;
        aroundMessage.threadId = obj.threadId;
        return aroundMessage;
    }
    toString() {
        return this.messageId.messageId;
    }
}
exports.AroundMessage = AroundMessage;
