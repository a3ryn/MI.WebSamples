import { SignalRProxyBase } from './SignalRProxy';

export class SignalRHubs {
    private static SignalRHubsMap: Map<string, SignalRProxyBase> =
    new Map<string, SignalRProxyBase>();

    static addNewHub<T>(name: string, hub: SignalRProxyBase) {
        console.log('adding new proxy to the map for hub name ' + name);

        if (hub)
            SignalRHubs.SignalRHubsMap.set(name, hub);
        else
            console.warn('Null hub was not saved to the map!');
        console.log(`After trying to add hub to map, there are ${SignalRHubs.SignalRHubsMap.size} items in map.`);
	}

	static delAllHubs() {
		SignalRHubs.SignalRHubsMap.clear();
	}

    static getHubByName<T>(name: string): SignalRProxyBase {
        console.log(`Getting hub by name: ${name}. Currently there are ${SignalRHubs.SignalRHubsMap.size} items in map.`);

        return SignalRHubs.SignalRHubsMap.get(name);
    }

    static signalRStarted = () =>
        SignalRHubs.SignalRHubsMap.forEach((v, k) => {
            if (v.signalRStarted)
                v.signalRStarted();
        });
}
