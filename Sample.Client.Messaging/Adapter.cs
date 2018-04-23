using System;

namespace Sample.Client.Messaging
{
    internal class Adapter : IDisposable
    {
        public void Dispose()
        {
            throw new NotImplementedException();
        }

        internal void Subscribe<T>(Action<IMessage> p)
        {
            throw new NotImplementedException();
        }

        internal void Unsubscribe<T>()
        {
            throw new NotImplementedException();
        }
    }
}