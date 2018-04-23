import { ICommand } from './MessageBaseTypes';
import * as pd from './MessagePayloadTypes';

//Specialized/concrete Command types

export interface TraceCommand
    extends ICommand<pd.TraceRequest> {
}
//...