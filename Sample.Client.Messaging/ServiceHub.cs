using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace Sample.Client.Messaging
{

    #region Hub for Simple (String) messaging
    public interface IMessageClient
    {
        void Send(string m);
    }

    public class SimpleServiceHub : Hub<IMessageClient>
    {
        /// <summary>
        /// This will be called every time a NEW CLIENT (i.e., Session) is established. Multiple channels opened from within the same SPA will not trigger this.
        /// </summary>
        /// <returns></returns>
        public override Task OnConnected()
        {
            Debug.WriteLine($"*********************************SimpleServiceHub.OnConnected(): {Context.ConnectionId}");
            if (string.IsNullOrEmpty(UrlFrag))
            {
                var url = Context.Request.Url;
                UrlFrag = $"{url.Host}:{url.Port}";
            }
            HubManager.Instance.AddHub(this);
            return base.OnConnected();
        }

        internal string UrlFrag { get; private set; } = string.Empty;

        public void Send(string message)
        {
            //Debug.WriteLine($"Sending message (in SRV): {message}");
            // Call the broadcastMessage method to update clients.
            if (string.IsNullOrEmpty(UrlFrag))
            {
                var url = Context.Request.Url;
                UrlFrag = $"{url.Host}:{url.Port}";
            }

            Clients.All.Send($"[{UrlFrag}] Server says: {message}");
        }
    }
    #endregion


    #region Hub for complex Event messaging
    public interface IEventClient
    {
        void Handle(IMessage m);
    }

    public class EventServiceHub : Hub<IEventClient>
    {
        public EventServiceHub()
        {
            Debug.WriteLine("instance of ESH: " + GetHashCode());
            if (bool.TryParse(System.Configuration.ConfigurationManager.AppSettings["Messaging.Enabled"], out enableMessaging))
                enableMessaging = true;
        }

        private bool enableMessaging = true;

        public void Handle(IMessage message)
        {
            //Debug.WriteLine($"Sending message (in SRV): {message}");
            // Call the broadcastMessage method to update clients.
            Clients.All.Handle(message);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            Console.WriteLine("------- Disconnected!");
            if (stopCalled)
                ReleaseAdapter();
            return base.OnDisconnected(stopCalled);
        }

        private Adapter _adapter;

        /// <summary>
        /// Called from the client side, after SignalR is setup; this will
        /// trigger the adapter initialization and starting to listen for messages from the receiving queues.
        /// </summary>
        public void StartReceiving()
        {
            Debug.WriteLine("START RECEIVING CALLED FROM CLIENT");
            if (_adapter == null) //lazy init
                InitMessageAdapter();
        }

        private void InitMessageAdapter()
        {
            if (!enableMessaging) return;

            Debug.WriteLine("Initializing the Messaging Adapter ...");

            _adapter = new Adapter();
            Debug.WriteLine("Adapter created");

            StartListening();
            Debug.WriteLine("Adapter started listening");
        }

        private void StartListening()
        {
            try
            {
                //listen for notifications and reponses only
                _adapter.Subscribe<INotification>((m) => Handle(m));
                _adapter.Subscribe<IResponse>((m) => Handle(m));
            }catch(Exception e)
            {
                //If you get here, it means that RabbitMQ + Services are not started
                Debug.WriteLine("Exception in Messaging Adapter when subscribing to messages:", e);
            }
        }

        private void ReleaseAdapter()
        {
            if (!enableMessaging) return;

            if (_adapter != null)
            {
                _adapter.Unsubscribe<INotification>();
                _adapter.Unsubscribe<IResponse>();
                _adapter.Dispose();
            }
        }
    
    }
    #endregion

}
