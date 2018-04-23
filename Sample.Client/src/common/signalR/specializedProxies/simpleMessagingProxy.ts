import { SignalRProxy } from '../SignalRProxy';
import { SimpleServiceHub } from './ProxyDelegatesProvider';

export class SimpleClientMessaging extends SignalRProxy<string> {
    constructor() {
        super(SimpleServiceHub);
    }

    setHandlers = () => {
        //client handling incoming "send" notification from server:
        this.msgHub.client.send = this.msgHandler;
        this.msgHub.client.started = this.msgListenerStarted;
        this.startedDel = this.msgListenerStarted;
        //others if needed
    }

    public send = (m : string) =>
        this.msgHub.server.send(m); //server handling request "send" from clientt

    msgListenerStarted = () => {
        console.log('^^^^^^^^^^^^^^^^^^^^in SimpleClientMessaging.msgListenerStarted()')
    }
}