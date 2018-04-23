/*
This source file is under MIT License (MIT)
Copyright (c) 2016 Mihaela Iridon
https://opensource.org/licenses/MIT
*/

import { SignalRProxyBase } from './SignalRProxy';

export interface IProxyDelegates {
    CtorDelegate(name:string) : () => SignalRProxyBase;
}



