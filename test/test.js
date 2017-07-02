var mocha = require('mocha');
var io = require('socket.io-client');
var assert = require('assert');

const initSocketConnections = (done) => {
    const initialized = [0, 0];
    const host = 'http://localhost:443';
    const socketBroadcaster = io(host);
    const socketListener = io(host);
    socketBroadcaster.on('connect', () => {
        if(initialized[0]) {
            done();
        } else {
            initialized[1] = 1;
        }
    });
    socketListener.on('connect', () => {
        if(initialized[1]) {
            done();
        } else {
            initialized[0] = 1;
        }
    });
    return [socketBroadcaster, socketListener];
};

const destroySockets = (socketBroadcaster, socketListener, done) => {
    const destroyed = [0, 0];
    socketBroadcaster.on('disconnect', () => {
        if(destroyed[0]) {
            done();
        } else {
            destroyed[1] = 1;
        }
    });
    socketListener.on('disconnect', () => {
        if(destroyed[1]) {
            done();
        } else {
            destroyed[0] = 1;
        }
    });
    socketBroadcaster.disconnect();
    socketListener.disconnect();
}

describe('Basic functionality', () => {
    let socketBroadcaster, socketListener;
    beforeEach(done => {
        [socketBroadcaster, socketListener] = initSocketConnections(done);
    });
    afterEach(done => {
        destroySockets(socketBroadcaster, socketListener, done);
    });
    it('should post a new thread', (done) => {
        const newThreadData = {
            "date":"2017-07-01T23:00:38.603Z", 
            "messageId":"someId123", 
            "threadId": null, 
            "location": {"lat":"1","lng":"2"}, 
            "messageBody":"some random Message body hello world"
        };
        socketListener.on('addAroundMessage', (data) => {
            assert(newThreadData, data);
            done();
        })
        socketBroadcaster.emit('addAroundMessage', newThreadData);
    });

    it('should add an around to a thread created', (done) => {
        const newThreadData = {
            "date":"2017-07-01T23:00:38.603Z",
            "threadId": null, 
            "location": {"lat":"1","lng":"2"}, 
            "messageBody":"some random Message body hello world"
        };
        const addThisToExistingThread = {
            "date":"2017-07-01T23:00:38.603Z",
            "location": {"lat":"1","lng":"2"}, 
            "messageBody":"this is a reply to an existing thread"
        };
        socketListener.on('addAroundMessage', (data) => {
            addThisToExistingThread.threadId = data.threadId;
            if(data.messageBody !== addThisToExistingThread.messageBody) {
                socketBroadcaster.emit('addAroundMessage', addThisToExistingThread);
            } else {
                assert(data.messageBody, addThisToExistingThread.messageBody);
                done();
            }
        });
        socketBroadcaster.emit('addAroundMessage', newThreadData);
    })
})