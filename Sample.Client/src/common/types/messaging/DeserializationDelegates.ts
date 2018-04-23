import * as nt from './Notifications';
import * as rt from './Responses';
import MapUtils from '../../util/MapUtils';
import * as pd from './MessagePayloadTypes';

export const deserializationDelegates = new Map<string, (any) => Object>([
    ['DeviceAdded', (n) => MapUtils.deserialize(nt.DeviceAddedNotification, n)],
    ['TraceData', (n) => MapUtils.deserialize(rt.TraceResponse, n)]
]);