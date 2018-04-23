using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sample.Client.WebServices.Models
{
    public class NavItem
    {
        public int Id { get; set; }
        public string Display { get; set; }
        public string Route { get; set; }
        public string Tooltip { get; set; }
        public int DisplayIndex { get; set; }
        public bool IsVisible { get; set; } = true;
    }
}