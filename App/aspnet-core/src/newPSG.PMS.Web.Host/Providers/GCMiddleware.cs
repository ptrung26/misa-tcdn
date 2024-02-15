using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace newPSG.PMS.Web
{
    public class GCMiddleware
    {
        private readonly RequestDelegate _next;

        public GCMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            await _next(httpContext);
            //GC.Collect(2, GCCollectionMode.Optimized, true);
            //GC.Collect(2, GCCollectionMode.Forced, true);
            GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced);
            GC.WaitForPendingFinalizers();
        }
    }
}
