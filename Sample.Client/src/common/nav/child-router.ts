import { ViewResolver } from '../ViewResolver';
import { routeMaps, setStaticSeedRoute } from '../util/configUtil';
import { inject } from 'aurelia-framework';
import { NavRepository } from '../../services/navConfigService';

@inject(NavRepository)
export class ChildRouter extends ViewResolver {
    router: any;
    heading = 'Child Router';
    navRepo: NavRepository;

    constructor(navRepo) {
        super();
        this.navRepo = navRepo;
    }

    configureRouter(config, router) {
        setStaticSeedRoute(config);

        routeMaps(this.navRepo) //your repo/service doing the async HTTP fetch, returning a Promise<Array<any>> (i.e., the routes)
            .then(r => {
                r.forEach(route => this.router.addRoute(route));
                //once all dynamic routes are added, refresh navigation:
                this.router.refreshNavigation();
            });
    }
}
