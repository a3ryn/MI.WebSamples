//COMMAND I/F
export interface ICommand { //marker I/F
}

export interface ICommandWithPayload<T> extends ICommand {
    payload: T;
}

//COMMAND BASE
export class CommandBase implements ICommand{
    protected constructor() { }
    static createCommand = () => new CommandBase();
}

export class CommandBaseWithPayload<T> implements ICommandWithPayload<T> {
    protected constructor(payload: T) {
        this.payload = payload;
    }

    static createCommand = (payload) => new CommandBaseWithPayload(payload);

    payload: T;
}

//HANDLER I/F
export interface ICommandHandler<T extends ICommand> {
    handle(cmd: T);
}




 
