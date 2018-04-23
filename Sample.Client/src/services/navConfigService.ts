import { HttpClient } from 'aurelia-http-client';
import { HttpClient as HttpFetch, json } from 'aurelia-fetch-client';
import { ApiRoot } from '../common/util/constants';
import { inject } from 'aurelia-framework';

@inject(HttpClient, HttpFetch)
export class NavRepository {
    constructor(httpClient, httpFetch) {

        this.httpClient = httpClient;
        this.httpFetch = httpFetch;
    }

    navItems;
    httpClient: HttpClient;
    httpFetch: HttpFetch;

    getNavItems() {
        var promise = new Promise<Array<any>>((resolve, reject) => {
            if (!this.navItems) {
                this.httpFetch.fetch(ApiRoot + 'api/Nav') //calling http://localhost:48400/api/Nav
                    .then(response => response.json())
                    .then(data => {
                        this.navItems = data;
                        resolve(this.navItems);
                    }).catch(err => reject(err));
            }
            else
                resolve(this.navItems);
        });
        return promise;
    }

}