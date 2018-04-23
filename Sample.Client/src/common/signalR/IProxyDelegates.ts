import { SignalRProxyBase } from './SignalRProxy';

export interface IProxyDelegates {
    CtorDelegate(name:string) : () => SignalRProxyBase;
}



