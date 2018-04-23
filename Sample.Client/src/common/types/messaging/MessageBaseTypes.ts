export interface IMessage {
    Id: number;
    SourceId: string;
    Context;
    Type: string;
    toString: () => string;
}

export abstract class Message implements IMessage {
    Id: number;       //the identity of the message issuer
    SourceId: string; //the identity of the message issuer
    Context;
    Type: string;

    toString() {
        return `${this.Id}: type = ${this.Type}`;
    }
}

export enum NotificationFlag {
    Default = 0,
    Info,
    Warning,
    Error,
    Fatal
}

export interface IPayload { //marker interface for all payloads
    toString() : string;
}

export interface INotificationPayload extends IPayload {
}

export interface IResponsePayload extends IPayload {
}

export interface ICommandPayload extends IPayload {
}

export interface INotification<T extends IPayload> extends IMessage {
    Message: string;
    Status: NotificationFlag;
    Payload: T;
    //other properties to match the models sent by the server-side code
}

export abstract class Notification<T extends INotificationPayload>
    extends Message
    implements INotification<T>{
        Id: number = (<Message>this).Id;
        SourceId: string = (<Message>this).SourceId;
        Context = (<Message>this).Context;
        Type = (<Message>this).Type;
    
        Message: string;
        Status: NotificationFlag;

        Payload: T;

        toString() {
            let p = this.Payload ? this.Payload.toString() : 'no payload';
            return `${super.toString()} /status=${this.Status}. Text=${this.Message}. Payload=${p}`;
        }
} 

export interface IResponse<T extends IResponsePayload, TCommand extends ICommand<ICommandPayload>>
    extends IMessage {
        Command: TCommand;
        Payload: T;
        //other properties to match the models sent by the server-side code
}

export abstract class Response<T extends IResponsePayload, TCommand extends Command<ICommandPayload>>
    extends Message
    implements IResponse<T, TCommand>{
        Command: TCommand;
        Payload: T;
        toString() {
            return `${super.toString()} /Command=${this.Command ? this.Command.toString() : ''}. ` +
                `Payload=${this.Payload.toString()}`;
        }
}

export interface ICommand<T extends ICommandPayload> extends IMessage {
    Payload: T;
}

export abstract class Command<T extends ICommandPayload>
    extends Message
    implements Command<T>{
    Payload: T;
    toString() 
    {
        return `${super.toString()} / Payload =${this.Payload.toString()}`;
    }
}
