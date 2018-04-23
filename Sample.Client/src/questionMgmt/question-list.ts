import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, BindingEngine } from 'aurelia-framework';
import * as e from './messages';
import { Question } from '../common/types/Questions';
import { QuestionsAPI } from '../services/questionsAPIService';
import { isNullOrUndefinedOrEmpty } from '../common/util/func';
import { DialogService } from 'aurelia-dialog';
import { QuestionModifiedPrompt } from './questionModifiedPrompt';

@inject(QuestionsAPI, EventAggregator, BindingEngine, DialogService) 
export class QuestionList  {
    constructor(api, ea, be, ds) { //order must match that from @inject
        this.api = api; //the client services (webAPI)
        this.ea = ea; //needed for event subscriptions
        this.be = be; //needed for observable collection
        this.ds = ds; //needed to confirm navigation away from unsaved changes

        //initialize state
        this.questions = [];
        //this.selectedId = null;
        console.log('QuestionList.CTOR: done');
    }

    //injected instances
    api: QuestionsAPI;
    ea: EventAggregator;
    be: BindingEngine;
    ds: DialogService;

    //state variables
    //main data set:
    questions: Array<Question>;
    selectedItem: Question;
    //vars for handling navigation cancelling when data was changed but not yet saved
    nextActivation;
    crtActivation;
    questionChangedInfo = { id: 0, modified: null };
    //navigation-related
    router;
    

    //subscribers
    questionViewedSub;
    questionChangedSub;
    questionDetailClearedSub

    //-------------------
    //---component events
    //-------------------

    created() {
        this.api.getQuestionList()
            .then(questions => {
                this.questions = questions;
                this.checkAndSetSelection();
            })
            .catch(reason => alert(reason));
        console.log('****************************************************');     
    } 

    attached() {
        console.log('QuestionList.Attached(). Subscribing to events.');
        //subscribe to event aggregator events:
        this.questionChangedSub = this.ea.subscribe(e.QuestionChanged, msg => this.questionChangedInfo = { id: msg.id, modified: msg.changedFields });
        this.questionDetailClearedSub = this.ea.subscribe(e.QuestionDetailCleared, msg => this.unselectCurrentItem());
		this.questionViewedSub = this.ea.subscribe(e.QuestionViewed, msg => this.select(msg.question));
    }

    detached() {
        //disposing of event subscriptions
        this.questionViewedSub();
        this.questionChangedSub();
        this.questionDetailClearedSub();

        //clear state regarding selection:
        this.unselectCurrentItem();
        this.resetQuestionChangedInfo(0);
    }

    
    //-----------------------
    //UI requests and clicks
    //----------------------
    select(question) { //selection triggers navigation (and activation in the question-detail component)
        console.log("SELECT in LIST");
        if (question == null || question == undefined) {
            this.selectItem(0);
            return false;
        }

        if (this.questionChangedInfo.id > 0 && !isNullOrUndefinedOrEmpty(this.questionChangedInfo.modified))//cannot navigate
        {
            console.log('!!!! BLOCK NAV');
            console.log(this.questionChangedInfo);

            this.nextActivation = question;
            this.confirmNavigation().then(r => { return r; });
            
            return false;
        }

        this.resetQuestionChangedInfo(question.id); //reset
        this.selectItem(question.id);
        console.log('-----------select.TRUE-----------------');
        this.crtActivation = this.selectedItem;
        this.nextActivation = null;
        return true;
    }

    
    //UTILITES (mainly for navigation and controlling selection changes
    clearSelection = () => this.unselectCurrentItem();
    
    unselectCurrentItem = () => {
		console.log('count of questions: ' + this.questions.length);
        if (this.selectedItem != null)
            this.selectedItem.active = ''; //this updates the item's active flag in the data source
        this.selectedItem = null; //this one sets the local pointer to null
    };

    selectItem = (id: number) => {
        this.unselectCurrentItem();
        let found = this.questions.find(a => a.id === id);

        if (found != null) {
            this.selectedItem = found;
            this.selectedItem.active = 'active';
        }
    };

    resetQuestionChangedInfo = (id) => this.questionChangedInfo = { id: id, modified: null }; 

    checkAndSetSelection = () => {
        //check router first:
        let rId = this.router.currentInstruction.params.id;
        if (rId != null) {
            this.questionChangedInfo.id = +rId;
        }
        if (this.questionChangedInfo.id > 0) {
            console.log('QuestionList.created(): questionChangedInfo:');
            console.log(this.questionChangedInfo);
            let n: number = this.questionChangedInfo.id;
            this.selectItem(n);
        }
    };

    confirmNavigation = () => {
        return this.ds.open({ viewModel: QuestionModifiedPrompt, model: this.questionChangedInfo.modified })
            .then(response => {
                if (response.wasCancelled) {
                    console.log('cancelled');
                    return false;
                }
                else {
                    console.log('in else branch in promise');
                    let nextId = this.nextActivation.id;
                    this.resetQuestionChangedInfo(nextId);
                    this.select(this.nextActivation);
					this.router.navigate(`questions/${nextId}`);
                    return true;
                }

            });
    };
}
