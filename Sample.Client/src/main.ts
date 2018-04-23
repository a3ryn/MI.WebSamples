import { configureGlobalCaches } from './common/util/configUtil';
import { SignalRInitUtil } from './common/signalR/signalRutil';
import { ProxyDelegates } from './common/signalR/specializedProxies/ProxyDelegatesProvider';
import { LogManager } from "aurelia-framework";
import { ConsoleAppender } from "aurelia-logging-console";

export function configure(aurelia) {
    configureGlobalCaches(aurelia);

    SignalRInitUtil.initSignalRProxies(new ProxyDelegates()); //signalR; proxies must be configured in signalRUtil.ts (under src/common/signalR folder)

    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.debug);

    aurelia.use
        .standardConfiguration()
        .developmentLogging() //to use with 'console.log' statements
        .plugin('aurelia-animator-css') //may cause issues in IE in which case need to reinstall the plugin with jspm and with typings (both):
        .plugin('aurelia-dialog')      //see example plugin install for dialog: https://github.com/aurelia/dialog
        .plugin('aurelia-validation');

    aurelia.start().then(a => a.setRoot()).catch(e => console.log(e));
}


