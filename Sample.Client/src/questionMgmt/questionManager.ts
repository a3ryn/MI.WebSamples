import { ViewResolver } from '../common/ViewResolver';
import { QuestionList } from './question-list';
import { QuestionDetail } from './question-detail'; //'questionMgmt/question-detail'
import { inject } from 'aurelia-framework';

@inject(QuestionList)
export class QuestionManager extends ViewResolver {
    router: any;
    heading = 'Site Question Provisioning';
    itemsVm: QuestionList;

    constructor(al: QuestionList) {
        super();
        this.itemsVm = al; //inject them so that we can control the VM initialization and binding 
        al.selectedItem = null;
        console.log('QuestionManager.CTOR: DONE');
    }
    
    configureRouter(config, router2) {
        console.log('CONFIG ROUTER 2_____________________');
        config.title = 'Questions';
        config.map([
            { route: '', moduleId: 'questionMgmt/no-selection', title: 'Select' },
            { route: 'questions/:id', moduleId: 'questionMgmt/question-detail', name: 'questions' }
        ]);

        this.router = router2;
        console.log('setting router in itemsVm (list)');
        this.itemsVm.router = router2; //we can do this ONLY BECAUSE we use the itemsVM as an instance whose lifecycle is tied to that of this questionManager class;
        //otherwise, it will be created every time its view loads and we lose the router. (this is accomplished by using <compose> with instance binding)
    }

    new() {
		this.router.navigate('questions/0');
    }
}