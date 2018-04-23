import { SignalRProxy } from './SignalRProxy';
import { SignalRHubs } from './signalRProxyCache';

export abstract class VMClientBase<TMessage, TProxy
    extends SignalRProxy<TMessage>> {
    protected proxy: TProxy;

    constructor(hubName: string) {
        console.log(`SignalRClientBase.CTOR for hub named ${hubName}`);
        let hub = <TProxy>SignalRHubs.getHubByName<TMessage>(hubName);
        console.log(hub);
        if (hub) {
            this.proxy = hub;

            console.log(this.proxy);
            console.log('SignalRClientBase.CTOR DONE');
        }
        else
            throw new Error('Could not retrieve SignalR proxy for hub named ' + hubName);
    }

    protected setMsgHandler(h: (m: TMessage) => void) {
        console.log('setting msg handler here........');
        this.proxy.msgHandlerDel = h;
    }

    public clearCachedMessages = () => this.proxy.clearCachedMessages();

    public get CachedMessages() { return this.proxy.CachedMessages; }
}


