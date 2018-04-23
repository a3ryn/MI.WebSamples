import { VMClientBase } from '../../common/signalR/SignalRClientBase';
import { EventClientMessaging } from '../../common/signalR/specializedProxies/eventMessagingProxy';
import { IMessage } from '../../common/types/messaging/MessageBaseTypes';
import { EventServiceHub } from '../../common/signalR/specializedProxies/ProxyDelegatesProvider';

//VM base for the Server Event feature
export abstract class EventClientBase extends VMClientBase<IMessage, EventClientMessaging> {
    //no specialized behavior at this time; when SENDING commands, then we would add the "SendCommand" method; see the simple messaging example
    constructor() {
        super(EventServiceHub);//the name of the hub proxy
    }
}