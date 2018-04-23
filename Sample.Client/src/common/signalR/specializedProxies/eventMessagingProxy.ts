/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/
import { SignalRProxy } from '../SignalRProxy';
import { EventServiceHub } from './ProxyDelegatesProvider';
import { IMessage } from '../../types/messaging/MessageBaseTypes';

export class EventClientMessaging extends SignalRProxy<IMessage>{
    constructor() {
        super(EventServiceHub);
    }

    signalRStarted = () => this.msgHub.server.startReceiving(); //overriding the base class action

    setHandlers = () => {
        this.msgHub.client.handle = this.msgHandler;
        this.msgHub.client.started = this.evtListenerStarted;
        this.startedDel = this.evtListenerStarted;
    }

    evtListenerStarted = () => {
        console.log('^^^^^^^^^^^^^^^^^^^^in EventClientMessaging.evtListenerStarted()')
    }

}