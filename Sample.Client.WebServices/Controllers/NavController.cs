using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sample.Client.WebServices.Controllers
{
    using Models;
    using System.Configuration;

    public class NavController : ApiController
    {
        private static readonly string MenuItemPrefix = ConfigurationManager.AppSettings["MenuItemPrefix"] ?? "#";

        private static readonly NavItem[] Items = new NavItem[]
            { //data should be retrieved from the DB; navigation items should be configurable!
                //new NavItem { Display = "*Github Users", Tooltip="Test page for user display", Route= "users" },
                //new NavItem { Display = "*Child Router", Tooltip = "Test page for embedded navigation", Route="child-router" },
                //new NavItem { Display = "Question Manager", Tooltip="Simplified Site Manager View", Route="questionManager" },
                new NavItem { Id = 1, Display = $"{MenuItemPrefix}Simple Messaging", Tooltip="Basic Chat-like SignalR Test Page", Route="clSignalR" },
                new NavItem { Id = 2, Display = $"{MenuItemPrefix}Second Messaging", Tooltip="Basic Chat-like SignalR Test Page", Route="secondSignalR" },
                //new NavItem { Display = "Server Events", Tooltip="SignalR Notification Receiver", Route="eventReceiver" }
            };

        // GET api/<controller>
        public IEnumerable<NavItem> Get() => Items;
        public NavItem Get(int id) => Items.FirstOrDefault(x => x.Id == id);
    }
}