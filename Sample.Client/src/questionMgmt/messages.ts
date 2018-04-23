import { Question } from '../common/types/Questions';

export interface IQuestionEvent {

}

export class QuestionViewed implements IQuestionEvent {
    constructor(question) {
        this.question = question;
    }
    question;
}

export class QuestionDetailCleared implements IQuestionEvent {
}

export class QuestionChanged implements IQuestionEvent {
    constructor(id, changedFields) {
        this.id = id;
        this.changedFields = changedFields;
    }
    id;
    changedFields;
}