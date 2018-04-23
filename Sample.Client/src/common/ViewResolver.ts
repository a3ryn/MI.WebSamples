import { viewPath, viewRouteMap } from './util/constants';
import { coalesce } from './util/func';

//Base class for all modules that map to an HTML view file.
export class ViewResolver {
    constructor() {
        console.log('ViewResolver.CTOR');
        
        let derivedClass = this.getName();
        let mappedPath = viewRouteMap.get(derivedClass);
        console.log(`This is a type of ${derivedClass}. Mapped value = ${mappedPath}.`);

        let v2 = coalesce(mappedPath, derivedClass);

        console.log(`Setting the view path to ${v2}`);    
        this.view = v2;    
    }

    public view: string;

    //This is the reason for the base class - must specify the view path if not stored together with the JS file
    public getViewStrategy() {
        let path = `${viewPath}${this.view}.html`
        console.log(`view path=${path}`);
        return path;
    }

    getName() {
        //NOTE: this may not work in all browsers. (so far works OK in Chrome and IE Edge (v11))
        return (<any>this).constructor.name;

        //If the above does not work, use below code:
        //var funcNameRegex = /function (.{1,})\(/;
        //var results = (funcNameRegex).exec((<any>this).constructor.toString());
        //return (results && results.length > 1) ? results[1] : "";
    }
}