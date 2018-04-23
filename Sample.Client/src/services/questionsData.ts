import * as q from '../common/types/Questions';

export class QuestionCache{
    constructor() {
		this.questionsData = //create some fake/simulated questions
            new Array<q.Question>(
                q.Question.create<q.Prompt>(q.Prompt, 'startPromptTest', 1),
				q.Question.create<q.YesNoQuestion>(q.YesNoQuestion, 'yesNoTest', 4, null, 'yes or no'),
                q.Question.create<q.RankQuestion>(q.RankQuestion, 'rankingTest', 6, null, 'Range from 1 to 5 for ranking response')
            );
        console.log("cache initialized in CTOR");
    }

    public questionsData : Array<q.Question>;
}