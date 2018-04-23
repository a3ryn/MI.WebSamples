import { Response } from './MessageBaseTypes';
import * as cmd from './Commands'; //responses are tied to the commands (they are a result of handling)
import * as pd from './MessagePayloadTypes';

//Specialized/concrete Response types

export class TraceResponse
    extends Response<pd.TraceData, cmd.TraceCommand> {
}

//....