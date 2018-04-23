using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using static WebApiClientUtility.ApiClient;
using static System.Configuration.ConfigurationManager;

namespace NLBSimulator.Controllers
{
    public enum BaseAddressSelector
    {
        Cycle,
        Random,
        Fixed
    }
    public class NlbController : ApiController
    {
        static NlbController()
        {
            BaseAddresses = AppSettings["baseAddresses"]?.Split(',');
            Enum.TryParse(AppSettings["cycle_random_fixed_BaseAddress"], out NextAddressScheme);
            int.TryParse(AppSettings["fixed_BasedAddress_index"], out FixedBasedAddressIndex);
        }

        private static readonly string[] BaseAddresses;
        private static readonly BaseAddressSelector NextAddressScheme;
        private static readonly int FixedBasedAddressIndex = 0;

        private static Dictionary<BaseAddressSelector, Func<int>> IndexSelector = new Dictionary<BaseAddressSelector, Func<int>>
        {
            [BaseAddressSelector.Cycle] = () => Interlocked.Increment(ref crtAddrIx) % 2,
            [BaseAddressSelector.Random] = () => rand.Next(0, BaseAddresses.Length),
            [BaseAddressSelector.Fixed] = () => FixedBasedAddressIndex
        };


        private static int crtAddrIx = 0;
        private static int NextAddrIndex => IndexSelector[NextAddressScheme]();

        public object Get(int id) => Redirect($"{NextAddress}api/nav/{id}");

        private static string GetAddress(string target)
        {
            var addr = $"{NextAddress}{target}";
            System.Diagnostics.Debug.WriteLine($"=======>>>>>>> Redirecting request to: {addr}");
            return addr;
        }

        public object Get(string target) => Redirect(GetAddress(target));

        static Random rand = new Random();
        private static string NextAddress
            => BaseAddresses[NextAddrIndex];

    }
}
