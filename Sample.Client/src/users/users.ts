import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import { ViewResolver } from '../common/ViewResolver';

export class User {
	//login: string;
}

@inject(HttpClient)
export class Users extends ViewResolver{
  http: HttpClient;
  heading = 'Github Users';
  users = [];
  //users: User[];

  constructor(http) {
      super();
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('https://api.github.com/');
    });

    this.http = http;
  }

  activate(){
    return this.http.fetch('users')
      .then(response => response.json())
      .then(users => this.users = users as any);
  }
}
