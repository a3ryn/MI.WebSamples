import { Notification } from './MessageBaseTypes';
import * as pd from './MessagePayloadTypes';
import { JsonProperty } from '../../util/MapUtils';

//Specialized/concrete Notification types

export class DeviceAddedNotification
    extends Notification<pd.DeviceAdded> {

    constructor() {
        super();
        this.Message = (<Notification<pd.DeviceAdded>>this).Message;
        this.Status = (<Notification<pd.DeviceAdded>>this).Status;
        this.Payload = (<Notification<pd.DeviceAdded>>this).Payload;
    }

    @JsonProperty('Payload')
    Payload: pd.DeviceAdded;

}
//define all other specialized notification types here...