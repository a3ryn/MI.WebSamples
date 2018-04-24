import { RouteMapItem } from '../types/RouteMapItem' ;

//DEFINITIONS
//vaues
export const greeting = "Cheers!";
export const viewPath = ""; //"/dist/views/"; //"/src/views/"; //"/dist/src/views/"; //
export const Inject_QuestionsCacheId = "QuestionsCache";
export const ApiRoot = "http://localhost:48401/"; // "http://localhost/SignalRNavApi2/"; //
export const SignalRHubBaseUrls = ["http://localhost:48400/", "http://localhost/SignalRNavApi2/"];
export const SignalRHubPath = "dist/src/signalr";

export const viewRouteMap = new Map([ //VM class name to view name
    ['Users', 'users/users'],
    ['ChildRouter', 'common/nav/child-router'],
    ['Welcome', 'welcome/welcome'],
    ['QuestionManager', 'questionMgmt/questionManager'],
    ['QuestionList', 'questionMgmt/question-list'],
    ['QuestionDetail', 'questionMgmt/question-detail'],
	['SimpleMessagingClient', 'messaging/clSignalR'],
	['SimpleMessagingClient2', 'messaging/secondSignalR'],
    ['EventReceiver', 'messaging/eventReceiver']
]);

export const routeToModuleMap = new Map([ //the key must match what we get from the webAPI service as far as navigation configuration is concerned
    ['welcome', 'welcome/welcome'],
    ['users', 'users/users'],
    ['child-router', 'common/nav/child-router'],
    ['questionManager', 'questionMgmt/questionManager'],
	['clSignalR', 'messaging/clSignalR'],
	['secondSignalR', 'messaging/secondSignalR'],
    ['eventReceiver', 'messaging/eventReceiver']
]);

////these are now built dynamically from NAV config data retrieved from web API service (api/Nav) call
//export const menuOptionsWithRoutes = new Map<string, RouteMapItem>([
//    ['Welcome', new RouteMapItem(['', 'welcome'], 'welcome', 'welcome/welcome', 'Welcome')],
//    ['Users', new RouteMapItem('users', 'users', 'users/users', 'Github Users')],
//    ['ChildRouter', new RouteMapItem('child-router', 'child-router', 'common/nav/child-router', 'Child Router')],
//    ['QuestionManager', new RouteMapItem('questionManager', 'questionManager', 'questionMgmt/questionManager', 'Question Manager')],
//    ['SimpleMessagingClient', new RouteMapItem('clSignalR', 'clSignalR', 'messaging/clSignalR', 'Simple Messaging')],
//    ['EventReceiver', new RouteMapItem('eventReceiver', 'eventReceiver', 'messaging/eventReceiver', 'Server Events')]
//]);








