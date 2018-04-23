import { coalesce } from '../util/func';

export class RouteMapItem {
    constructor(public Routes: string | Array<string>,
        public Name: string,
        public ModuleId: string = null,
        public Title: string,
        public Nav: boolean = true)
    {
        this.Routes = Routes;
        this.Name = Name;
        this.ModuleId = coalesce(ModuleId, Name);
        this.Nav = Nav;
        this.Title = Title;
    }
}