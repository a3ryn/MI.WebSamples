import { coalesce, coalesceExt } from '../util/func';
import * as at from './QuestionType';
import * as img from '../util/imgMap';

let id = 0;

function getId() {
    return ++id;
}

interface IQuestion {
    id: number;
    name: string;
    qType: at.QuestionType;
    desc: string;
    created: Date;
    active: string;
}

export abstract class Question implements IQuestion {
    public qType: at.QuestionType;

    constructor(public id: number,
                public name: string,
                type: string,
                typeId: number,
                public desc: string,
                public created: Date,
                public active: string = '') {
        this.qType =
            typeId == undefined
                ? at.QuestionTypes.get(type)[0] //first
                : at.QuestionTypes.get(type).find(x => x.ObjectTypeId == typeId);
        this.name = name;
        this.id = id;
        this.desc = desc;
        this.created = created == null ? new Date() : created;
        this.active = '';
    }

    //if using the form below, then in the markup we must use: ${question.img}   to call it like a property getter
    public get img() {
        return this.getImgFileName(this.qType.ObjectTypeId); //Q: do we want to buffer this value? or look it up every time?
    }

    //if using the form below, then in the markup we must use: ${question.img()}   to call it like a function
    //public img = () => this.getImgFileName(this.aType.ObjectTypeId);

    public static create<T extends Question>(a: { new (id, name, typeid, desc, date): T; }, name: string, typeId: number, id?: number, desc?: string, date?: Date): T {
        return new a(coalesceExt(id, getId()), name, typeId, desc, date);
    }

    public static createEmtpy<T extends Question>(a: { new (id, name, typeid, desc, date): T; }): T {
        return new a(0, null, null, null, null);
    }

    public static clone(obj : Question) : Question {
        let del = QuestionTypesMapWithCtorDelegates2.get(obj.qType.Type);
        if (del != undefined) {
            return del(obj.id, obj.name, obj.qType.ObjectTypeId, obj.desc, obj.created);
        }
        else
            console.log('undefined delegate!');
    }

    public toString() {
        return `name=${this.name}; id=${this.id}; type=${this.qType.Type}; typeid=${this.qType.ObjectTypeId}; description=${this.desc}`;
    }

    getImgFileName(tid: number) {
        return img.imgMap.get(tid);
    }

    public static areEqual(a1: Question, a2: Question) {
        let mismatch = new Array<string>();
        Question.eqPropDel.forEach((v, k) => { //IMPORTANT: This is the way to iterate over maps
            if (v(a1) !== v(a2))
                mismatch.push(k);
        });

        let isMismatch = mismatch.length > 0;
        let result = { areEqual: !isMismatch, mismatch: `${mismatch.join(', ')}` }; //IMPORTANT: this is how to join array items into a string with separator
        console.log(result);
        return result;
        
    }

    //would be nice to build this dynamically in a static CTOR based on decorators placed on the properties?
    private static eqPropDel = new Map<string, (a: Question) => any>([
        ['created', (a: Question) => (a.created == null || a.created == undefined) ? null : a.created.getTime()],
        ['id', (a: Question) => a.id],
        ['desc', (a: Question) => a.desc],
        ['name', (a: Question) => a.name],
        ['type', (a: Question) => a.qType],
        //['img', (a: Question) => a.img]
    ]);
}

export class Prompt extends Question {
    constructor(id: number, name: string, typeId: number, desc?: string, img?: string, date?: Date) {
        super(id, name, 'Prompt', typeId, coalesceExt(desc, 'Does not expect a user input'), date);
    }
}

export class YesNoQuestion extends Question {
    constructor(id: number, name: string, typeId: number, desc?: string, img?: string, date?: Date) {
        console.log('desc =' + desc);
        super(id, name, 'YesNoQuestion', typeId, coalesceExt(desc, 'Expects a binary with optional Not-applicable or Dont-know answer'), date);
    }
}

export class RankQuestion extends Question {
    constructor(id: number, name: string, typeId: number, desc?: string, img?: string, date?: Date) {
        super(id, name, 'RankQuestion', typeId, coalesceExt(desc, 'Expects a numeric ranking user input'), date);
    }
}

export const QuestionTypesMapWithCtorDelegates = new Map<string, (x: string, y: string, t: number) => Question>([
	['Prompt', (name, desc, tid): Question => Question.create<Prompt>(Prompt, name, tid, null ,desc)],
	['YesNoQuestion', (name, desc, tid): Question => Question.create<YesNoQuestion>(YesNoQuestion, name, tid, null, desc)],
	['RankQuestion', (name, desc, tid): Question => Question.create<RankQuestion>(RankQuestion, name, tid, null, desc)],
    //TODO add more as needed
]);

export const QuestionTypesMapWithCtorDelegates2 = new Map<string, (id, name, tid, desc, date) => Question>([
	['Prompt', (id, name, tid, desc, date): Prompt => new Prompt(id, name, tid, desc, date)],
	['YesNoQuestion', (id, name, tid, desc, date): YesNoQuestion => new YesNoQuestion(id, name, tid, desc, date)],
	['RankQuestion', (id, name, tid, desc, date): RankQuestion => new RankQuestion(id, name, tid, desc, date)],
    //TODO add more as needed
]);


