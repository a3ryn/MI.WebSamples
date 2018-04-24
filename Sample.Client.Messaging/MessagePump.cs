using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Diagnostics.Debug;

namespace Sample.Client.Messaging
{
    internal static class MessagePump
    {
        static MessagePump()
        {
            if (!int.TryParse(System.Configuration.ConfigurationManager.AppSettings["Hub.Events.PushInterval.Seconds"], out PushIntervalSec))
                PushIntervalSec = 30;
        }

        private static int PushIntervalSec = 30;
        private static readonly string[] events = new[] { "EventRinging", "EventEstablished", "EventHeld", "EventRetrieved", "EventReleased", "EventTransferInit", "EventConferenceInit" };
        private static Random rand = new Random();
        internal static string UrlFrag { get; set; } = string.Empty;
        internal static Action<string> Broadcast { get; set; }

        public static void StartEventsPump()
        {
            WriteLine("++++++ Starting Events Pump");
            PushMessages();
        }
        public static void StopEventsPump()
        {
            WriteLine("------ Stopping Events Pump");
            stopPump = true;
        }
        private static bool stopPump = false;

        private static void PushMessages() =>
            Task.Run(async () =>
            {
                while (!stopPump)
                {
                    var r = DateTime.Now.ToString("HH:mm:ss ffff");
                    var s = $"[{UrlFrag}] {events[rand.Next(0, events.Length)]}  (received at {r})";
                    WriteLine($"Pump Issuing Event: {s}");
                    Broadcast?.Invoke(s);
                    await Task.Delay(PushIntervalSec * 1000);
                }
            });
    }
}
