import { orderBy } from '../util/func';

export type QuestionType = {
    Type: string;
    ObjectTypeId: number;
    ObjectTypeName: string;
}

export const QuestionTypes = new Map<string, Array<QuestionType>>([
	['Prompt', new Array<QuestionType>(
		<QuestionType>{ Type: 'Prompt', ObjectTypeId: 1, ObjectTypeName: 'Start Prompt' },
		<QuestionType>{ Type: 'Prompt', ObjectTypeId: 2, ObjectTypeName: 'End Prompt' },
		<QuestionType>{ Type: 'Prompt', ObjectTypeId: 30, ObjectTypeName: 'No Response Prompt' },
		<QuestionType>{ Type: 'Prompt', ObjectTypeId: 31, ObjectTypeName: 'Invalid Response Prompt' },
	)],
	['YesNoQuestion', new Array<QuestionType>(
		<QuestionType>{ Type: 'YesNoQuestion', ObjectTypeId: 4, ObjectTypeName: 'Yes No Question' },
		<QuestionType>{ Type: 'YesNoQuestion', ObjectTypeId: 5, ObjectTypeName: 'Yes-No-Dont Know Question' }
	)],
	['RankQuestion', new Array<QuestionType>(
		<QuestionType>{ Type: 'RankQuestion', ObjectTypeId: 6, ObjectTypeName: 'Numeric Rank Question' }
	)]
]);

export const QuestionTypesList = () : Array<QuestionType> => {
    let items = [];
    QuestionTypes.forEach((v, k) => {
        items = items.concat([].concat.apply([], v));
    });
    //sorting by Type, then by TypeName (within the category):
    //equivalent of items.OrderBy(x => x.Type).ThenBy(x => x.ObjectTypeName)
    items = orderBy(items, [x => x.Type, x => x.ObjectTypeName]);
    console.log(items);
    return items;
}

