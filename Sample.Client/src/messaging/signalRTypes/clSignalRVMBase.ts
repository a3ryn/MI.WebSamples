import { SimpleClientMessaging } from '../../common/signalR/specializedProxies/simpleMessagingProxy';
import { VMClientBase } from '../../common/signalR/SignalRClientBase';
import { SimpleServiceHub } from '../../common/signalR/specializedProxies/ProxyDelegatesProvider';

//VM base for the Simple Messaging feature
export abstract class SimpleMessageClientBase extends VMClientBase<string, SimpleClientMessaging> {
    constructor() {
        super(SimpleServiceHub);
    }

    public send = (m: string) => {
        if (this.proxy.stopped) {
            throw new Error('Cannot send message. Hub is stopped.');
        }

        this.proxy.send(m);
    }
}
