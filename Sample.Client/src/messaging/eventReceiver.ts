/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/
import { EventClientBase } from './signalRTypes/eventReceiverVMBase';
import * as msg from '../common/types/messaging/MessageBaseTypes';
import MapUtils from '../common/util/MapUtils';
import { deserializationDelegates } from '../common/types/messaging/DeserializationDelegates';

//each class extending the SignalRClientBase will use a different hub potentially; they are mapped in configUtil;
export class EventReceiver extends EventClientBase {

    constructor() {
        super();
        //the main event handler delegate:
        this.proxy.msgHandlerDel = this.msgHandler;

        //the following delegates should be instantiated only if needed
        this.proxy.startedDel = this.started; //if needed
        this.proxy.reconnected = this.reconnected;
        this.proxy.reconnecting = this.reconnecting;
    }

    get canClear() { return this.CachedMessages.length > 0; }

    public clear = () => this.clearCachedMessages();

    //TODO: refactor to be specific about message types stringification
    public stringifyMessage = (message: msg.Message): string => {
        let del = deserializationDelegates.get(message.Type); //via map
        console.log(del);
        let typedMessage = //MapUtils.deserialize(n.DeviceAddedNotification, message); //for directl deserialization
            del ? del(message) : undefined; //using delegate
        let s = typedMessage.toString();
        return s;
    }


    public msgHandler = (m: msg.IMessage) => {
        console.log('################## my specialized handler kicked in');
    }

    public started = () => 
        console.log('################## started EVENT RECEIRVER specialized');

    public reconnected = () =>
        console.log('################## RECONNECTED specialized ER');

    public reconnecting = () =>
        console.log('################## RECONNECTing specialized ER');
    
}