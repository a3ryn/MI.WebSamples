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
using static System.Configuration.ConfigurationManager;
using System.Net;

namespace WebApiClientUtility
{

    internal class TestData
    {
        internal enum Env
        {
            Pass,
            Hash,
            BasicAuth,
            SMhashTest,
            Fail
        }

        internal TestData(string userName, string password)//, string apiBaseUri, string apiGetDataPath)
        {
            UserName = userName;
            Password = password;
        }

        internal string UserName { get; set; }
        internal string Password { get; set; }

        private static readonly Dictionary<Env, TestData> data = new Dictionary<Env, TestData>
        {
            { Env.Hash, new TestData("admin", "007301330071001540F909DD00FC089D207F0E3F30760077")}, //with clear password (actual hash)
            { Env.Fail, new TestData("nonexistentUSR", "bla")}, //should fail authorization as this user does not exist (not a registered user)
        };

        internal static TestData Get(Env env)
        {
            return data[env];
        }
    }

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
        //internal Func<string, T> JsonDeserializer => (x) => JsonConvert.DeserializeObject<T>(x, _jsonSettings);
        internal T Deserialize(string json)
        {
            return JsonConvert.DeserializeObject<T>(json, _jsonSettings);
        }
    }

    public static class ApiClient
    {
        private static readonly string BaseUri = AppSettings["ApiBaseUrl"];
        private static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.All
        };

        private static readonly IEnumerable<RequestData> Requests = new List<RequestData>
        {
            new RequestData<IEnumerable<object>>("api/nav"),
            new RequestData<object>("api/nav/2"),
        };

        private static string GetToken()
        {
            var env = TestData.Env.Pass;
            var data = TestData.Get(env);

            //var reg = Register(data.UserName, data.Password, data.ApiBaseUri).Result;

            string token = null;
            //Get the token
            try
            {
                token = GetApiToken(data.UserName, data.Password, BaseUri).Result;
                Console.WriteLine("Token: {0}", token);
                return token;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception getting the token: {ex.Message}");
                Console.ReadKey();
                Environment.ExitCode = 1;
                return null;
            }
        }


        public static string MakeGetRequest(string baseUri, string uri, bool configureAwait = false)
            => MakeApiGetRequest(null, baseUri, uri, configureAwait).Result;

        public static HttpResponseMessage MakeHttptRequest(string baseUri, string uri)
            => MakeRedirectRequest(baseUri, uri).Result;

        public static T MakeGetRequest<T>(string baseUri, string uri, JsonSerializerSettings jsonSerSettings = null)
        {
            Debug.WriteLine($"=====>>>>> GET REQUEST RECEIVED: Base URI = {baseUri}, Relative URI = {uri}");
            var response = MakeGetRequest(baseUri, uri);
            var result = JsonConvert.DeserializeObject<T>(response, jsonSerSettings);
            return result;
        }

        internal static void Run()
        {
            
            var deserialize = false;

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
                var response = MakeApiGetRequest(null, BaseUri, r.Uri, true).Result;
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

                    PrintDeserializedData(r, response, gm, rt);
                }
            }

            Console.WriteLine($"\n\n ***** Press any key to exit ...");

            Console.ReadKey();
        }

        private static void PrintDeserializedData(RequestData r, string response, MethodInfo gm, string rt)
        {
            try
            {
                dynamic resources = gm.Invoke(r, new object[] { response });
                if (resources == null)
                {
                    Console.WriteLine("Null result after deserialization.");
                }
                else if (resources is IEnumerable)
                {
                    Console.WriteLine(
                        $"Retrieved {(resources as IEnumerable<object>)?.Count()} resources of type {rt}.");
                }
                else
                {
                    Console.WriteLine(
                        $"Retrieved a single resource of type: {rt}. ID = {resources?.Id}");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(
                    $"Could not deserialize response. Check if type metadata was included in the response. Reason: {e.Message}");
            }
        }

        private static async Task<HttpResponseMessage> Register(string userName, string password, string apiBaseUri)
        {
            using (var client = new HttpClient())
            {
                //setup client
                client.BaseAddress = new Uri(apiBaseUri);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                //setup registration data
                var formContent2 = new FormUrlEncodedContent(new[]
                {
                     //new KeyValuePair<string, string>("grant_type", "password"),
                     new KeyValuePair<string, string>("login", userName),
                     new KeyValuePair<string, string>("password", password),
                     new KeyValuePair<string, string>("confirmpassword", password),
                     new KeyValuePair<string, string>("email", "test@abc.com")
                     });

                //send requeset
                var registerResponse = await client.PostAsync("/api/Account/Register", formContent2);



                return registerResponse;
            }
        }

        private static async Task<string> GetApiToken(string userName, string password, string apiBaseUri)
        {
            using (var client = new HttpClient())
            {
                //setup client
                client.BaseAddress = new Uri(apiBaseUri);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                //setup login data
                var formContent = new FormUrlEncodedContent(new[]
                {
                     new KeyValuePair<string, string>("grant_type", "password"),
                     new KeyValuePair<string, string>("username", userName),
                     new KeyValuePair<string, string>("password", password),
                     });

                //send request
                HttpResponseMessage responseMessage = await client.PostAsync("/Token", formContent);

                //get access token from response body
                var responseJson = await responseMessage.Content.ReadAsStringAsync();
                var jObject = JObject.Parse(responseJson);
                return jObject.GetValue("access_token").ToString();
            }
        }

        static async Task<HttpResponseMessage> MakeRedirectRequest(string baseUri, string relUri)
        {
            using (var client = new HttpClient())
            {
                //setup client
                client.BaseAddress = new Uri(baseUri);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("*/*"));

                var response = await client.GetAsync(relUri).ConfigureAwait(false);
                return response;
            }
        }
        static async Task<string> MakeApiGetRequest(string token, string apiBaseUri, string requestPath, bool configAwait)
        {
            using (var client = new HttpClient())
            {
                //setup client
                client.BaseAddress = new Uri(apiBaseUri);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                if (token != null)
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                //make request
                var response = await client.GetAsync(requestPath).ConfigureAwait(configAwait);
                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    return content;
                }

                return $"Some error occured. Status code = {response.StatusCode}";
            }
        }


    }
}
