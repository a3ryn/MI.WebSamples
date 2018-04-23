This project hosts the server-side WebAPI services that the client-side services will send requests to.
As an example, the NavController supplies the navigation routes to the client as a result of an HTTP Fetch request made from the NavRepository client-side service.

IMPORTANT:
All of the WebAPI Services exposed/implemented here will be co-hosted under the SAME URL root as the main Web project. 
To do this, the Startup clas is removed from this project, while this project itself is added as a direct reference to the main Web project (Sample.Client).
The Startup.cs file of the main Web project will be used to initialize the web application.
Similarly, the GLOBAL.ASAX was removed from this project, while the main Web project's Global.asax file is used instead. It is pointing to this project's WebApiStarter class.
