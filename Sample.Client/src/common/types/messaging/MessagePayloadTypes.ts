import { INotificationPayload, IResponsePayload, ICommandPayload } from './MessageBaseTypes';
import { JsonProperty } from '../../util/MapUtils';

//Payloads for Notifications:
export class DeviceAdded implements INotificationPayload { 
    DeviceName = (<DeviceAdded>this).DeviceName;
    toString() { return this.DeviceName; }
    
}
//...

//Payloads for Responses:
export class TraceData implements IResponsePayload {
    Traces: Array<any>; //todo, create specialized type for Trace
    toString() { return `traces count = ...`; }
}
//...

//Payloads for Commands:
export class TraceRequest implements ICommandPayload {
    FromPortId: number;
    ToPortId: number = null;
    toString() { return 'Not implemented'; }
}
//...