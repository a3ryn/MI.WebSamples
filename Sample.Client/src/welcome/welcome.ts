import {computedFrom} from 'aurelia-framework';
import { ViewResolver } from '../common/ViewResolver';

export class Welcome extends ViewResolver{

	heading = 'SignalR with Client Reconnect (HA) Prototype';
	content = [
		'The two menu options and routes are served from the server-hosted WebAPI Controllers. (The WebAPI Service URL is configured under constants.js/ts)',
		'WebAPI uses CORS so the service can be deployed as a separate web app, at a different URL',
		'Both messaging views (from the menu) use the same SignalR hub (hence, same session/context ID)',
		'SignalR URLs to connect to are configured under constants.js/ts and are used (as the HUB url) in a round-robin fashion before calling start() on the hub. Any number of (base) URLs are supported.',
		'SignalR component is also configured to use CORS so that clients can connect to hubs crosshosted -domain',
		'The SignalR Hub is hosted as part of the main web application, not the WebAPI Services. A message pump is started to push events to all clients',
		'The time interval to push events is configurable, in the web.config of the client web app (Hub.Events.PushInterval.Seconds; default 30 seconds)',
		'Any client can send a message through the hub and all subscribed clients will receive it, including the sending client, with some extra text added on the Server side (including the URL of the server-side hub)',
		'The form below is used to demonstrate two-way binding with Aurelia'
	];

	bindingDivVisible = false;
	get canShow() {
		return this.bindingDivVisible;
	}

	showHideTextSuffix = "Two-Way Binding Form";
	showHideText = `Show ${this.showHideTextSuffix}`;
	showBinding() {
		this.bindingDivVisible = !this.bindingDivVisible;
		let prefix = this.bindingDivVisible ? "Hide" : "Show";
		this.showHideText = `${prefix} ${this.showHideTextSuffix}`;		
	}

  firstName = 'John';
  lastName = 'Doe';
  previousValue = this.fullName;

  //Getters can't be observed with Object.observe, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below.
  //@computedFrom('firstName', 'lastName')
  get fullName(){
    return `${this.firstName} ${this.lastName}`;
  }

  submit(){
    this.previousValue = this.fullName;
    alert(`Welcome, ${this.fullName}!`);
  }

  canDeactivate() {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }
}

