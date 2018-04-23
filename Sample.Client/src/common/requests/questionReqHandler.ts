import { inject, Lazy } from 'aurelia-framework';
import * as rh from '../commands/questionCmdsAndHandlers';
import { Question } from '../types/Questions';

//only the request handlers know about commands and command hanlders, not the VMs

//inject as many command handlers as needed
@inject(Lazy.of(rh.CreateQuestionHandler), Lazy.of(rh.DeleteQuestionHandler), Lazy.of(rh.GetQuestionsHandler))
export class QuestionRequestsHandler {
    constructor(
        h1: rh.CreateQuestionHandler,
        h2: rh.DeleteQuestionHandler,
        h3: rh.GetQuestionsHandler
    ) {
        this.createQuestionHandler = h1;
        this.deleteQuestionHandler = h2;
        this.getQuestionsHandler = h3;
        //console.log('QuestionRequestsHandler.CTOR: injected h1:' + h1);
    }

    private createQuestionHandler;
    private deleteQuestionHandler;
    private getQuestionsHandler;
    //other injected handlers here

    public addNewQuestion = (question : Question) =>
        this.createQuestionHandler() //lazy init of injected CreateQuestionHandler
            .handle(rh.CreateQuestionCommand.createCommand(question));

    public deleteQuestion = (id: number) =>
        this.deleteQuestionHandler()
            .handle(rh.DeleteQuestionCommand.createCommand(id));

    public hasQuestions = () =>
        this.getQuestionsHandler()
            .handle(rh.GetQuestionsCommand.createCommand([-1]))
            .lenght > 0;
}