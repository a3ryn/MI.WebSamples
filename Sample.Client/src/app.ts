import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';
import 'fetch';
import { HttpClient } from 'aurelia-http-client';
import { HttpClient as HttpFetch, json } from 'aurelia-fetch-client';
import { ViewResolver } from './common/ViewResolver';
import { NavRepository } from './services/navConfigService';
import { routeMaps, setStaticSeedRoute } from './common/util/configUtil';
import { inject } from 'aurelia-framework';

@inject(NavRepository)
export class App extends ViewResolver {
    router: any;

    constructor(navRepo) {
        super();
        this.navRepo = navRepo;
        console.log('APP CTOR DONE');
    }

    routes;
    navRepo;

    configureRouter(config, router) {
        setStaticSeedRoute(config);

        routeMaps(this.navRepo) //your repo/service doing the async HTTP fetch, returning a Promise<Array<any>> (i.e., the routes)
            .then(r => {
                r.forEach(route => this.router.addRoute(route));
                //once all dynamic routes are added, refresh navigation:
                this.router.refreshNavigation();
            });

        this.router = router;
    }

    
}