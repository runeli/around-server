"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AroundStore = (function () {
    function AroundStore() {
        this.messages = [];
    }
    AroundStore.prototype.add = function (message) {
        if (this.isMessageValid(message)) {
            this.messages.push(message);
        }
        else {
            console.warn("Unable to add message " + message.id.messageId + ". Validation errors exist");
        }
    };
    AroundStore.prototype.cleanAll = function () {
        this.messages = [];
    };
    AroundStore.prototype.get = function (count) {
        if (count) {
            return this.messages.splice(count);
        }
        else {
            return this.messages;
        }
    };
    AroundStore.prototype.isMessageValid = function (message) {
        if (this.isMessageBodyValid(message) && this.isAroundMessageLocationValid(message)) {
            return true;
        }
        else {
            return false;
        }
    };
    AroundStore.prototype.getUniqueMessageId = function () {
        return { messageId: this.messages.length.toString() };
    };
    AroundStore.prototype.isAroundMessageLocationValid = function (message) {
        /*
        The valid range of latitude in degrees is -90 and +90 for the southern and northern hemisphere respectively.
        Longitude is in the range -180 and +180 specifying coordinates west and east of the Prime Meridian, respectively.
        */
        if (message.location.lat < -90 || message.location.lat > 90) {
            return false;
        }
        if (message.location.lng < -180 || message.location.lat > 180) {
            return false;
        }
        return true;
    };
    AroundStore.prototype.isMessageBodyValid = function (message) {
        if (message.messageBody.length > 240) {
            console.warn(message + ": message body length exceeds 240 character limit");
            return false;
        }
        if (message.messageBody.length === 0) {
            console.warn(message + ": message body is zero");
            return false;
        }
        return true;
    };
    return AroundStore;
}());
exports.default = AroundStore;
