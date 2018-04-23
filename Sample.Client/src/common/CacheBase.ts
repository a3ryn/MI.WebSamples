import { Question } from './types/Questions';
import { QuestionCache } from '../services/questionsData';
import { inject } from 'aurelia-framework';
import { log } from './util/configUtil';
import { Inject_QuestionsCacheId } from './util/constants';

@inject(Inject_QuestionsCacheId) //injection of data by data identifier
export class CacheBase {
    constructor(cache : QuestionCache) {
        this.questions = cache.questionsData;
        log.info("Base.CTOR: injected cache data:"); 
        log.debug(cache); //logging the object
    }

	public questions : Array<Question>;
}