import { DialogController } from 'aurelia-dialog';

export class QuestionModifiedPrompt {
    static inject = [DialogController];

    constructor(controller) {
        this.controller = controller;
    }

    mismatch: string;
    controller;

    activate(mismatch) {
        this.mismatch = mismatch;
    }
}