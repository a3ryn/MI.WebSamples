using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace HttpClientConsole
{

    internal abstract class RequestData
    {
        internal RequestData(string uri)
        {
            Uri = uri;
        }

        internal string Uri { get; }
    }
    internal class RequestData<T> : RequestData
    {
        internal RequestData(string uri) : base(uri)
        {
        }


        internal RequestData(string uri, JsonSerializerSettings settings) : base(uri)
        {
            _jsonSettings = settings;
        }

        private readonly JsonSerializerSettings _jsonSettings;

        internal T Deserialize(string json)
        {
            return JsonConvert.DeserializeObject<T>(json, _jsonSettings);
        }
    }

    public class NavItem
    {
        public int Id { get; set; }
        public string Display { get; set; }
        public string Route { get; set; }
        public string Tooltip { get; set; }
        public int DisplayIndex { get; set; }
        public bool IsVisible { get; set; } = true;

        public override string ToString()
            => $"NavItem: Id={Id}, Display={Display}, Route={Route}, IsVisible={IsVisible}";
    }

    internal class ApiClient
    {
        private static readonly string BaseUri = System.Configuration.ConfigurationManager.AppSettings["ApiBaseUrl"];
        //private static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        //{
        //    TypeNameHandling = TypeNameHandling.All
        //};

        private static readonly IEnumerable<RequestData> Requests = new List<RequestData>
        {
            new RequestData<IEnumerable<NavItem>>("api/nav"),
            new RequestData<NavItem>("api/nav/2"),
        };

        internal static void Run()
        {
            var deserialize = true;

            Console.WriteLine("Waiting for the WebAPI Service to startup... Press any key when ready to make request....");
            Console.ReadKey();

            var s = new Stopwatch();
            //now that we have the token, make some API requests:
            foreach (var r in Requests)
            {
                Console.WriteLine($"\n\nREQUEST URI: {r.Uri}. Press any key to make the request.......");
                Console.ReadKey();
                s.Reset();
                s.Start();
                var response = WebApiClientUtility.ApiClient.MakeGetRequest(BaseUri, r.Uri);
                s.Stop();

                Console.WriteLine($"Time: {s.ElapsedMilliseconds}[ms]. Response length = {response?.Length}");//\n\nResponse: {response}");

                if (deserialize)
                {
                    var gt = r.GetType();
                    var gm = gt.GetMethod("Deserialize", BindingFlags.NonPublic | BindingFlags.Instance);
                    if (gm == null)
                        continue;

                    var t1 = gt.GetGenericArguments().FirstOrDefault();
                    if (t1 == null) continue;
                    var rt = t1.IsGenericType && t1.GetGenericTypeDefinition() == typeof(IEnumerable<>)
                        ? t1.GetGenericArguments().FirstOrDefault()?.Name
                        : t1.Name;

                    try
                    {
                        dynamic resources = gm.Invoke(r, new object[] { response });
                        if (resources == null)
                        {
                            Console.WriteLine("Null result after deserialization.");
                        }
                        else if (resources is IEnumerable)
                        {
                            var items = resources as IEnumerable<object>;
                            Console.WriteLine(
                                $"Retrieved {items?.Count()} resources of type {rt}. Items=\n\t{string.Join("\n\t", items)}");
                        }
                        else
                        {
                            Console.WriteLine(
                                $"Retrieved a single resource of type: {rt}. Item=\n\t{resources?.ToString()}");
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(
                            $"Could not deserialize response. Check if type metadata was included in the response. Reason: {e.Message}");
                    }
                }
            }

            Console.WriteLine($"\n\n ***** Press any key to exit ...");

            Console.ReadKey();
        }

    }
}
