/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/
import { IReceivedMessagesCache, ReceivedMessagesCache } from './ReceivedMsgCache';
import { IMessage } from '../types/messaging/MessageBaseTypes';

export abstract class SignalRProxyBase {
    protected constructor(name: string) {
		this.proxyName = name;
		console.log("SignalRProxyBase.CTOR");
    }

    public abstract setHandlers: () => void;

    public setProxy = (p) => this.msgHub = p;
    public signalRStarted: () => void;

    public stopped = false;
    public tryingToReconnect = false;
    public proxyName: string;
 
    public static setHub = (h) => SignalRProxy.connection = h;

    protected msgHub; //the SignalR proxy
    protected static connection: SignalR.Hub.Connection;

    protected static invokeDel = (fname: string, f: (...args) => any, ...args) => {
        if (f)
            return f(args);
        console.log('NULL delegate for ' + fname);
        console.log(f);
    }

    reconnectedDel: () => void;
    reconnected = () => {
        this.stopped = false;
        console.log('RECONNECTED');
        SignalRProxy.invokeDel('reconnectedDel', this.reconnectedDel);
    }

    reconnectingDel: () => void;
    reconnecting = () => {
        this.tryingToReconnect = true;
        console.log('Trying to reconnect...');
        SignalRProxy.invokeDel('reconnectingDel', this.reconnectingDel);
    }

    startedDel: () => void; //to be set from clients that require to handle this event
    started = () => {
        console.log('STARTED ' + this.proxyName, true);
        SignalRProxy.invokeDel('startedDel', this.startedDel);
    }

    disconnectedDel: () => boolean; //to be set from clients that require to handle this event; /if returning true, hub will try to restart
    disconnected = () => {
        if (this.tryingToReconnect) {
            console.log('DISCONNECTED, trying to reconnect.');
            let start = SignalRProxy.invokeDel('disconnectedDel', this.disconnectedDel);
            //$.connection.hub.start(); //this won't work like this. must get a delegate
            if (start) {
                if (SignalRProxy.connection)
                    SignalRProxy.connection.start();
            }
        }
    }
}

//A SignalR Proxy Wrapper, specialized by the type of messages exchanged (by design);
//it cannot be instantiated from outside; it is itself responsible for initializing SignalR against a specific hub and starting SignalR 
export abstract class SignalRProxy<T> extends SignalRProxyBase { //cached === singleton (Created only once in configUtil at startup)
    protected constructor(name: string) {
        super(name);
        console.log('~~~ ~~~ ~~~ ~~~ ClientMessaging.CTOR: [should only be called once per generic tyype!]');
        this.mCache = new ReceivedMessagesCache<T>(); //create the cache to store this type of messages (singleton)
        console.log('ClientMessaging.CTOR: DONE');
    }

    protected mCache: IReceivedMessagesCache<T>; 

    msgHandlerDel: (m: T) => void;
    msgHandler = (message: T) => {
        console.log('___RECIVED MESSAGE:___');
        console.log(message);
        if (message)
            this.mCache.addMessage(message);

        SignalRProxy.invokeDel('msgHandlerDel', this.msgHandlerDel, message);
    }
        
    

    clearCachedMessages = () => this.mCache.clearAll();
    get CachedMessages() { return this.mCache.receivedMessages; }
}




