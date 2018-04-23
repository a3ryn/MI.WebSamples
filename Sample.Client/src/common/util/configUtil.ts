import { QuestionCache } from '../../services/questionsData';
//import { RouteMapItem } from '../types/RouteMapItem';
import { /*menuOptionsWithRoutes,*/ routeToModuleMap, Inject_QuestionsCacheId } from './constants';
import { NavRepository } from '../../services/navConfigService';
import { RouteMapItem } from '../types/RouteMapItem';
import { LogManager } from "aurelia-framework";

export var log = LogManager.getLogger('smPrototype');


//functions (configuration utilities)
export const configureGlobalCaches = (aurelia) => {
    let cache = new QuestionCache(); //should get this from server via client service call
    aurelia.use.instance(Inject_QuestionsCacheId, cache); //cached data
};

export const routeMaps = (navRepo: NavRepository) => {
    var promise = new Promise<Array<any>>((resolve, reject) => {
        //make webAPI Call to get navigation menus:
        let navItems: Array<any>;
        navRepo.getNavItems() //call to get nav items from co-hosted web API services
            .then(items => {
                    navItems =
                        items.sort(x => x.displayIndex) //sort by display order
                        .map(x => ({
                            route: x.route,
                            name: x.route,
                            moduleId: routeToModuleMap.get(x.route), //mapping of route name to module ID is defined in the constants module
                            nav: x.isVisible,
                            title: x.display
                    }));
                    resolve(navItems);
            })
    });
    return promise; 
};

export const setStaticSeedRoute = (config) =>
{
    config.title = 'MI';

    //configure one static route:
    config.map([
        { route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome/welcome', title: 'Welcome' }
    ]);
}

