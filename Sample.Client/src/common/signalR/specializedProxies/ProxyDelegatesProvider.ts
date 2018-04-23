/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/
import { SimpleClientMessaging } from './simpleMessagingProxy';
import { EventClientMessaging } from './eventMessagingProxy';
import { IProxyDelegates } from '../IProxyDelegates';
import { SignalRProxyBase } from '../SignalRProxy';

//The configuration of proxies; this uses specific data types to the application and will be 
//different from one application to another;
//For this reason, the configuration is kept separately from the signalR utility.

export const SimpleServiceHub = 'simpleservicehub';
export const SimpleServiceHub2 = 'simpleservicehub2';
export const EventServiceHub = 'eventservicehub';

export class ProxyDelegates implements IProxyDelegates {

    private static delegates: Map<string, () => SignalRProxyBase> =
    new Map<string, () => SignalRProxyBase>([
			[SimpleServiceHub, () => new SimpleClientMessaging()],
			[SimpleServiceHub2, () => new SimpleClientMessaging()],
			[EventServiceHub, () => new EventClientMessaging()]
    ]);

    CtorDelegate(name: string) {
        return ProxyDelegates.delegates.get(name);
    }
}