/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/
import { SimpleMessageClientBase } from './signalRTypes/clSignalRVMBase';


//the VM
export class SimpleMessagingClient extends SimpleMessageClientBase {
    public outgoingMessage: string;

    constructor() {
        super();
        this.proxy.msgHandlerDel = this.msgHandler;
        this.proxy.startedDel = this.started;
    }

    get canSend() { return this.outgoingMessage && this.outgoingMessage.length > 0 };

    public sendSimpleMessage = () => {
        this.send(this.outgoingMessage);
        if (this.clearOnSend)
            this.outgoingMessage = "";
    }

    get canClear() { return this.CachedMessages.length > 0; }

    public clear = () => this.clearCachedMessages();

    public clearOnSend: boolean = true;

    //implementation of msgHandler
     msgHandler = (m: string) => {
        console.log('################## my specialized/local handler kicked in');
    }

    started = () =>
         console.log('################## started SIMPLE MESSAGE RECEIRVER specialized');

    public reconnected = () =>
        console.log('################## RECONNECTED specialized CR');

    public reconnecting = () =>
        console.log('################## RECONNECTing specialized CR');

}