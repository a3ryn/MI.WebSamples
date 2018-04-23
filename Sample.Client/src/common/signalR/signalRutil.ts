/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/
import { SignalRProxy } from './SignalRProxy';
import { SignalRHubs } from './signalRProxyCache';
import { IProxyDelegates } from './IProxyDelegates';
import { ProxyDelegates } from './specializedProxies/ProxyDelegatesProvider';

export class SignalRInitUtil {
//initialization and startup of SignalR hubs for all the configured proxies (one time deal; future: to do dynamic discovery and startup)
    private static proxyCtorDelegates: IProxyDelegates;

    public static initSignalRProxies = (ctorDelegates: IProxyDelegates, url: string = null) => {
        if (ctorDelegates == undefined)
            throw new Error('Specialized SignalR proxy CTOR delegates must be provided!');

        console.log('initializing SignalR and proxies');
        SignalRInitUtil.proxyCtorDelegates = ctorDelegates;

        console.log('--->>> CONNECTION = ');
		let c = $.connection("http://localhost/SignalRNavApi2/dist/src/signalr"); //new connection for each specialized server-side hub
		console.log(c);

        if (c) {
			console.log('--->>> HUB = ');

			$.connection.hub.url = "http://localhost/SignalRNavApi2/dist/src/signalr/hubs";
			let h = $.connection.hub;

			if (url)
				$.connection.hub.url = url;
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

                if ($.connection.hub.state === SignalR.ConnectionState.Connected) { //that is because the connections is shared!
					console.log('SignalR is already started and connected.');
					//return;
				}
				//if ($.connection.hub.state === SignalR.ConnectionState.Reconnecting) {
				//	console.log(`~~~ ~~~ ~~~ SignalR RECONNECTING. QS=${$.connection.hub.qs}`);				
				//}
				else {
					//$.connection.hub.url = "http://localhost/SignalRNavApi2/dist/src/signalr/hubs";
					console.log(`Starting hub... at URL = ${h.url}`);
                    $.connection.hub.start()
                        .done(function () {
                            console.log(`.........SignalR Started/connected. Connection ID= ${h.id}`);
                            SignalRHubs.signalRStarted(); //raise event (may also be done with EventAggregator)
                            console.log('initSignalR - DONE');
                            return;
                        })
						.fail(function () { console.log('Could not connect'); });

					$.connection.hub.reconnecting(() => 
						console.log(`.........SignalR RECONNECTING. url= ${h.url}`)
					);

					$.connection.hub.disconnected(() => {
						
						console.log(`.........SignalR DISCONNECTED. url= ${h.url}`);
						SignalRInitUtil.deleteAllProxies();

						h.url = "http://localhost/SignalRNavApi2/dist/src/signalr";

						SignalRProxy.setHub(h);
						console.log(h);
						console.log('...reconnect: proxies=');
						console.log(h.proxies);				

						//var connection = $.hubConnection("http://localhost/SignalRNavApi2/dist/src/signalr/hubs", { useDefaultPath: false });					

						for (let name in h.proxies) {
							console.log(`--->>> PROXY found: Name=${name} = `);
							console.log('iterating: ----- name = ' + name);
							let mHub = h.proxies[name];
							console.log(mHub);
							SignalRInitUtil.createProxyInstance(name, mHub);
						}
						console.log('starting hub again.........');
						$.connection.hub.start()
							.done(function () {
								console.log(`.........SignalR Started/REconnected. Connection ID= ${h.id}.`);
								SignalRHubs.signalRStarted(); //raise event (may also be done with EventAggregator)
								console.log('initSignalR - DONE DONE');
								return;
							})
							.fail(function () { console.log('Could not connect'); });
						
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