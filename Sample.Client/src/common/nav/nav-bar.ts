import {bindable} from 'aurelia-framework';
import {ViewResolver} from '../ViewResolver';

export class NavBar extends ViewResolver {
    //constructor() {
    //    console.log('in NavBar CTOR');
    //}
    //public getViewStrategy() {
    //    let path = './dist/src/views/nav-bar.html';
    //    console.log(`view path=${path}`);
    //    return path;
    //}

  @bindable router = null;

}
