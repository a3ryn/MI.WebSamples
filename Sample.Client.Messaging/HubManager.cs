using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Diagnostics.Debug;

namespace Sample.Client.Messaging
{
    public class HubManager
    {
        private static readonly Lazy<HubManager> instance = new Lazy<HubManager>(() => new HubManager());
        private HubManager()
        {
            
        }

        public void Start() => MessagePump.StartEventsPump();
        
        public void Stop() => MessagePump.StopEventsPump();


        public static HubManager Instance => instance.Value;

        private SimpleServiceHub hub;

        public void AddHub(SimpleServiceHub h)
        {
            var hash = h.GetHashCode();
            WriteLine($"HubManager.AddHub called for new hub with hash = {hash}. Current Hub: {hub?.GetHashCode()}");
            WriteLine($"NEW: {h.Context?.GetHashCode()}; SAVED: {hub?.Context?.GetHashCode()}");
            if (hub == null)
            {
                WriteLine("ADDING HUB in HubManager.");
                hub = h;
                MessagePump.Broadcast = m => hub.Clients.All.Send(m);
                MessagePump.UrlFrag = h.UrlFrag;
            }
            else
            {
                WriteLine("HUB already added in HubManager");
            }
        }


    }
}
