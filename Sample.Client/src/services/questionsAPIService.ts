import * as q from '../common/types/Questions';
import { clone } from '../common/util/func';
import { QuestionCache } from './questionsData';
import { CacheBase } from '../common/CacheBase';
import { log } from '../common/util/func';
import { ICommand, ICommandHandler, CommandBaseWithPayload } from '../common/commands/cmdInterfaces';
import * as ac from '../common/commands/questionCmdsAndHandlers';
import { Question, QuestionTypesMapWithCtorDelegates as QuestionTypes } from '../common/types/Questions';

let latency = 200;

export class QuestionsAPI extends CacheBase {
    isRequesting = false;

    constructor(c) {
        super(c);
        console.log('QuestionsAPI.CTOR');
    }

    delMap = new Map<string, (args?) => Promise<any>>([
        ['GET', () => this.getQuestionList()],
        ['GETONE', (id) => this.getQuestionDetails(id)],
        ['SAVE', (a) => this.saveQuestion(a)],
        ['DELETE', (id) => this.deleteQuestion(id)]
    ]);


    executeCommand(op: string, args?) {
        console.log(`Service Request: ${op}. Arguments = ${args}`);
        this.isRequesting = true;
        if (this.delMap.has(op))
            return this.delMap.get(op)(args);
        throw 'Invalid operation';
    }


    //@log
    getQuestionList = () =>
        new Promise<Array<q.Question>>(resolve => {
            setTimeout(() => {
                let results = this.questions;//do NOT clone here! binding directly to collection 
                resolve(results);
                this.isRequesting = false;
            }, latency);
        });

    //@log
    getQuestionDetails = (id) =>
        new Promise<q.Question>(resolve => {
            setTimeout(() => {
				let found = this.questions.filter(x => x.id == id)[0];
                let cloned = q.Question.clone(found);
                resolve(cloned);
                this.isRequesting = false;
            }, latency);
        });


    //@log
    saveQuestion = (question : q.Question) =>
        new Promise<q.Question>(resolve => {
            setTimeout(() => {
				console.log(`question name=${question.name}; type=${question.qType.ObjectTypeId}`);
                let instance = q.Question.clone(question);
                console.log(`instance name=${instance.name}`);
				let found = this.questions.filter(x => x.id == question.id)[0];

                if (found) { //update
					let index = this.questions.indexOf(found);
                    //do not simply set ref to instance; it will break binding in VM's list of items
					this.questions[index].name = instance.name;
					this.questions[index].desc = instance.desc;
					this.questions[index].qType = instance.qType;
                    //images should not be saved; they are fixed

					console.log('questions is now: ' + this.questions[index].name);
                }
                else { //create new
                    console.log(`created new ${question.qType.Type} with id=${instance.id}: ${instance}`);
					this.questions.push(instance);
					console.log('added new question. Questions length = ' + this.questions.length);
                }
                this.isRequesting = false;
                resolve(instance);
            }, latency);
        });


    //@log
    deleteQuestion = (id) =>
        new Promise<number>(resolve => {
			var ixToDelete = this.questions.findIndex(x => x.id == id);
            console.log('index to delete = ' + ixToDelete);
            if (ixToDelete > -1)
				this.questions.splice(ixToDelete, 1);
            else
                console.warn(`question with ID=${id} not found!`);
            this.isRequesting = false;
            resolve(id);
        });
}