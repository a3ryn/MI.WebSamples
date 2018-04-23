using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
using System.Diagnostics;
using System;
using Microsoft.Owin.Cors;

[assembly: OwinStartup(typeof(Sample.Client.Startup))] //this class

namespace Sample.Client
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            Debug.WriteLine("in Startup.Configuration()");

            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(110);
            GlobalHost.Configuration.DisconnectTimeout = TimeSpan.FromSeconds(30);
            GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(10);

           
            app.Map("/dist/src/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);

                var hubConfig = new HubConfiguration
                {
                    EnableDetailedErrors = true,
                    EnableJSONP = true
                };
                map.RunSignalR(hubConfig);
            });
            //var config = new HubConfiguration
            //{
            //    EnableJSONP = true,
            //    EnableDetailedErrors = true
            //};
            // app.MapSignalR("/dist/src/signalr", config); //all transpiled JS goes under dist/src; and so will generated signalr scripts

            Debug.WriteLine("in Startup.Configuration() - DONE");
        }
    }
}
