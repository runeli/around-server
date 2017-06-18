"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AroundMessage = (function () {
    function AroundMessage() {
    }
    AroundMessage.fromJsonLike = function (obj, messageId) {
        var aroundMessage = new AroundMessage();
        aroundMessage.date = new Date(obj.date);
        aroundMessage.location = obj.location;
        aroundMessage.messageBody = obj.messageBody ? obj.messageBody : "";
        aroundMessage.id = messageId;
        return aroundMessage;
    };
    AroundMessage.prototype.toString = function () {
        return this.id.messageId;
    };
    return AroundMessage;
}());
exports.AroundMessage = AroundMessage;
