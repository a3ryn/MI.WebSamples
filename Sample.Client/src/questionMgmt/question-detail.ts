import { EventAggregator } from 'aurelia-event-aggregator';
import { QuestionsAPI } from '../services/questionsAPIService';
import * as e from './messages';
import { areEqual, findEntryInMap } from '../common/util/func';
import { imgMap } from '../common/util/imgMap';
import { Question, Prompt, QuestionTypesMapWithCtorDelegates as QuestionTypeCtors } from '../common/types/Questions';
//import { QuestionRequestsHandler } from '../common/requests/questionReqHandler';
import { inject, bindable } from 'aurelia-framework';
import * as qt from '../common/types/QuestionType';
import { BootstrapFormRenderer } from '../common/util/bootstrapFormRenderer';
import {
    ValidationControllerFactory,
    ValidationController,
    ValidationRules
} from 'aurelia-validation';

@inject(QuestionsAPI, EventAggregator, ValidationControllerFactory)
export class QuestionDetail {
    constructor(
        public api: QuestionsAPI,
        public ea: EventAggregator,
        vcf: ValidationControllerFactory) {
            console.log('QuestionDetail.CTOR');
            this.vCtrl = vcf.createForCurrentScope();
            this.vCtrl.addRenderer(new BootstrapFormRenderer());
    }

    /* --code block below was used to identify Aurelia's component lifecycle and build the activity diagram from the design doc;
    created() {
        console.log(' ..... CREATED .......');
    }

    attached() {
        console.log(' ..... ATTACHED .......');
        this.setValidationRules();
    }

    canActivate() {
        console.log(' ..... CAN ACTIVATE .......');
    }

    canDeactivate() {
        console.log(' ..... CAN DEACTIVATE .......');
    }

    deactivate() {
        console.log(' ..... DEACTIVATE .......');
    }

    detached() {
        console.log(' ..... DETACHED .......');
    }

    bind() {
        console.log(' ..... BIND .......');
    }

    unbind() {
        console.log(' ..... UNBIND .......');
    }*/

    setValidationRules() {
        this.vCtrl.reset();
        if (this.question)
            ValidationRules
                .ensure('desc').maxLength(100).withMessage('Description length cannot exceed 100')
                .ensure('name').required().minLength(5).withMessage('Name must be at least 5 characters long')
                .on(this.question);
    }

    //rh: QuestionRequestsHandler;
    routeConfig;

	public question: Question;  //the currently displayed question to which the View binds to
    originalQuestion: Question;
    selectedType: qt.QuestionType;
    vCtrl: ValidationController;

    public questionTypesList = qt.QuestionTypesList(); //one time init with sort;  

    typeSelChanged() {
        this.question.qType = this.selectedType;
        this.checkModified();
    }
    
    activate(params, routeConfig) {
        console.log('..... ACTIVATE .......');
        this.routeConfig = routeConfig;
        if (params.id == 0)
        {
            console.log('params.id is ZERO');
            this.new(false);
            return;
        }
        return this.api.executeCommand('GETONE', params.id)
            .then(a => {
                this.commandSucceeded('GETONE', a);
            });     
    }

   
    get canSave() {
        return !this.vCtrl.errors.length && this.question.name && this.question.qType && !this.api.isRequesting;
    }

    save() {
        this.vCtrl.validate().then(() => {
            let questionToSave = this.question;
            let isNewQuestion = false;
            if (questionToSave.id == 0) {
                let del = QuestionTypeCtors.get(this.question.qType.Type);
                questionToSave = del(this.question.name, this.question.desc, this.question.qType.ObjectTypeId);
                isNewQuestion = true;
            }

            //this.vCtrl.validate().then(() => //save only when validation succeeds!
            this.api.executeCommand('SAVE', questionToSave).then(item => {
                this.commandSucceeded(isNewQuestion ? 'NEW' : 'UPDATE', item);
                this.ea.publish(new e.QuestionChanged(this.question.id, null));
            });

        }).catch(e => console.log(e));
    }

    new(nav:boolean = true) { //this only resets the views so that the user can enter new data
        console.log('in NEW');
        this.question = Question.createEmtpy<Prompt>(Prompt);//some default type
        this.question.desc = null; //to remove the default desc
        this.selectedType = this.question.qType;
        this.originalQuestion = Question.clone(this.question);
        this.setValidationRules();
        this.ea.publish(new e.QuestionDetailCleared());
        if (nav)
            this.routeConfig.navModel.router.navigate('questions/0');
    }

    get canDeleteOrClone() {
        return this.question.id > 0 && !this.api.isRequesting;
    }

    delete() {
        this.api.executeCommand('DELETE', this.question.id).then(deletedId => {
            this.commandSucceeded('DELETE', deletedId);
        }).catch(reason => alert(reason));
        //this.rh.deleteQuestion(this.question.id);
    }

    duplicate() {
        this.question = Question.clone(this.originalQuestion); //just in case we modified this.question on the screen since we selected it until we clicked "Clone"
        this.originalQuestion = null;
        this.question.id = 0;
        this.question.active = '';
        this.save();
    }

    checkModified() {
        //this.vCtrl.validate().catch(e => console.log('EEEEEEEERRRRRRROOOOOORRRRRRR'));

        let msg = ' ----> checking if modified: ';
        if (this.originalQuestion == null || this.originalQuestion == undefined) return; //adding new

        let areEqualResult = Question.areEqual(this.originalQuestion, this.question);
        if (!areEqualResult.areEqual)
        {
            msg += 'Modified fields: ' + areEqualResult.mismatch;
        }
        else {
            msg += 'NOT modified';
        }
        this.ea.publish(new e.QuestionChanged(this.question.id, areEqualResult.mismatch));
        console.log(msg);
    }

    commandSucceeded = (op: string, arg: Question | number) => {
        let isArgQuestion = arg instanceof Question;
        console.log(`commandSucceeded: OP=${op}. ARG=`);
        console.log(arg);

        this.question = isArgQuestion ? <Question>arg : null;
        this.setValidationRules(); //must always be set after updating this.question - as above
        this.originalQuestion = this.question == null ? null : Question.clone(<Question>this.question);
        this.selectedType = isArgQuestion ? this.question.qType : null;
        if (isArgQuestion)
            this.question.active = 'active';

        this.routeConfig.navModel.setTitle(isArgQuestion ? this.question.name : '');
        if (op === 'GETONE')
            this.ea.publish(new e.QuestionViewed(arg));

        if (!isArgQuestion) {
            this.new(); //simulate new item
        }
        else if (op === 'NEW') {
			this.routeConfig.navModel.router.navigate(`questions/${this.question.id}`);
        }
    };

    //evtCtorMap = new Map<string, (a : Question | number) => e.IQuestionEvent>([
    //    ['GETONE', (a) => new e.QuestionViewed(a)],
    //]);
}


