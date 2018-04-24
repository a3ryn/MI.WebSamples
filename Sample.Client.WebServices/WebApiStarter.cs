using System.Web;
using System.Web.Http;

namespace Sample.Client.WebServices
{
    public class WebApiStarter : HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}