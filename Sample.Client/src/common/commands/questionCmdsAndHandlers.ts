import { CacheBase } from '../CacheBase';
import { Question } from '../types/Questions';
import { ICommandHandler, CommandBaseWithPayload } from './cmdInterfaces';

export class CreateQuestionCommand 
    extends CommandBaseWithPayload<Question>{ //closing the generic type here
}

export class CreateQuestionHandler extends CacheBase
    implements ICommandHandler<CreateQuestionCommand>{

    public handle(cmd: CreateQuestionCommand) {
		console.log('handle(): payload (question to create) is ' + cmd.payload);
		this.questions.push(cmd.payload);
    }
}

//-------------------------

export class DeleteQuestionCommand
    extends CommandBaseWithPayload<number>{
}

export class DeleteQuestionHandler extends CacheBase
    implements ICommandHandler<DeleteQuestionCommand>{

    public handle(cmd: DeleteQuestionCommand) {
		console.log(`cache has ${this.questions.length} elements`)
        console.log('handle(): payload (question ID to delete) is ' + cmd.payload);
		var ixToDelete = this.questions.findIndex(x => x.id == cmd.payload);
        if (ixToDelete > -1)
			this.questions.splice(ixToDelete, 1);
        else
            console.warn('index not found!');
    }
}

//========================================
export class GetQuestionsCommand
    extends CommandBaseWithPayload<Array<number>>{
}

export class GetQuestionsHandler extends CacheBase
    implements ICommandHandler<GetQuestionsCommand>{
    public handle(cmd: GetQuestionsCommand) {
        console.log('cmd payload in GetQuestionsHandler.handle is ' + cmd.payload);
        if (cmd.payload.find(x => x == -1) != undefined) { //get all questions
			console.log('getting all questions. len = ' + this.questions.length);
			return this.questions;
        }
        else {
			let filtered = this.questions.filter(x => cmd.payload.find(y => y == x.id) != undefined);
			console.log('filtered question count = ' + filtered.length);
            return filtered;
        }
    }
}



