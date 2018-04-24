/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/
import { SignalRProxy } from './SignalRProxy';
import { SignalRHubs } from './signalRProxyCache';
import { IProxyDelegates } from './IProxyDelegates';
import { ProxyDelegates } from './specializedProxies/ProxyDelegatesProvider';
import { setTimeout } from 'timers';
import { SignalRHubBaseUrls, SignalRHubPath } from './../util/constants';

export class SignalRInitUtil {
//initialization and startup of SignalR hubs for all the configured proxies (one time deal; future: to do dynamic discovery and startup)
	private static proxyCtorDelegates: IProxyDelegates;

	private static crtIndex = 0;
	private static hubUrlsLength = SignalRHubBaseUrls.length;

	private static ctorDelegates = new ProxyDelegates();

	private static NextUrl = () => `${SignalRHubBaseUrls[SignalRInitUtil.crtIndex]}${SignalRHubPath}`;

	public static initSignalRProxies = (/*ctorDelegates: IProxyDelegates*/) => {
		if (SignalRInitUtil.ctorDelegates == undefined)
            throw new Error('Specialized SignalR proxy CTOR delegates must be provided!');

		console.log('initializing SignalR and proxies');
		SignalRInitUtil.proxyCtorDelegates = SignalRInitUtil.ctorDelegates;

		let nextUrl = SignalRInitUtil.NextUrl();
		console.log(`[${SignalRInitUtil.crtIndex}] Next URL = ${nextUrl}`);

		console.log(Date.now());
        console.log('--->>> CONNECTION = ');
			
		let c = $.connection(nextUrl, null, true);
		console.log(c);

        if (c) {
			console.log('--->>> HUB = ');

			let h = $.connection.hub;
			h.url = `${nextUrl}/hubs`;
			
			console.log(`URL on the HUB: ${h.url}. state = ${h.state}.`);
			console.log(h);
			console.log(h.url);

            if (h) {
                SignalRProxy.setHub(h);
                console.log('--->>> ALL PROXIES = ');
                console.log(h.proxies);

                //initialize clients and set the hub
                for (let name in h.proxies) {
                    console.log(`--->>> PROXY found: Name=${name} = `);
                    console.log('iterating: ----- name = ' + name);
                    let mHub = h.proxies[name];
                    console.log(mHub);
                    SignalRInitUtil.createProxyInstance(name, mHub);
                }

                if (h.state === SignalR.ConnectionState.Connected) { //that is because the connections is shared!
					console.log('SignalR is already started and connected.');
					//return;
				}
				//else if (h.state === SignalR.ConnectionState.Reconnecting) {
				//	console.log(`~~~ ~~~ ~~~ SignalR RECONNECTING. URL=${h.url}`);				
				//}
				else {
					console.log(`Starting hub... at URL = ${h.url}`);

					h.start()
                        .done(function () {
                            console.log(`.........SignalR Started/connected. Connection ID= ${h.id}`);
                            SignalRHubs.signalRStarted(); //raise event (may also be done with EventAggregator)
                            console.log('initSignalR - DONE');
                            return;
                        })
						.fail(function () { console.log('Could not connect'); });

					h.reconnecting(() => 
						console.log(`.........SignalR RECONNECTING. url= ${h.url}`)
					);

					h.disconnected(() => {
						console.log(`.........SignalR DISCONNECTED. url= ${h.url}. Stopping hub.`);

						SignalRInitUtil.crtIndex = (SignalRInitUtil.crtIndex + 1) % SignalRInitUtil.hubUrlsLength;
						let nextUrl = SignalRInitUtil.NextUrl();

						h.url = `${nextUrl}/hubs`;
						console.log(`Attempting to restart hub at other URL: ${h.url}`);
						h.start();
						return;
					});

                    return;
                }
            }
        }
        console.error('NULL SignalR proxy!!!!!!!!');
	}

	private static deleteAllProxies() {
		SignalRHubs.delAllHubs();
	}

    private static createProxyInstance(name: string, hub) {
        let del = //ProxyDelegates().get(name);
            SignalRInitUtil.proxyCtorDelegates.CtorDelegate(name);
        if (del) {
            let proxy = del();
			if (proxy) {
				console.log('Create Proxy Instance');
				console.log(hub);
                proxy.setProxy(hub);
				proxy.setHandlers();
                SignalRHubs.addNewHub(name, proxy);
                return;
            }
        }
        //Type must be defined and CTOR delegate specified in signalRConfig.ts:
        throw new Error(`Could not find proxy delegate for proxy named ${name}!`);
    }
}