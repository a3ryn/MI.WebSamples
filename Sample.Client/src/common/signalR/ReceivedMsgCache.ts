/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/


//one such instance per ClientMessaging instance (i.e. per proxy instance)
//it is intended to store received messages - in case this is required, say, for display - when navigating back and forth;
//but also has the ability to clear this 'cache'

export interface IReceivedMessagesCache<T>{
    receivedMessages: Array<T>;
    addMessage: (m:T) => void;
    clearAll: () => void;
}

export class ReceivedMessagesCache<T> implements IReceivedMessagesCache<T>{
    constructor() {
        console.log('initializing cache array');
        this.receivedMessages = new Array<T>();
    }

    public receivedMessages: Array<T>;

    public addMessage = (m: T) =>
        this.receivedMessages.push(m);

    public clearAll = () =>
        this.receivedMessages = [];
}

