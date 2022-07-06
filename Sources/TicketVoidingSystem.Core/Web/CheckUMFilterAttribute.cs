using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ONEbook.UM;
using ONEbook.UM.Configurations;
using ONEbook.UM.Services;

namespace TicketVoidingSystem.Core.Web
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class CheckUMFilterAttribute : ActionFilterAttribute
    {
        private readonly IMaintenanceService maintenanceService;
        private readonly UMClientConfiguration configuration;

        public CheckUMFilterAttribute(
            IMaintenanceService maintenanceService, UMClientConfiguration configuration)
        {
            this.maintenanceService = maintenanceService;
            this.configuration = configuration ?? UMClientManager.UMClientConfigs;
        }

        public override async void OnActionExecuting(ActionExecutingContext context)
        {
            if (await maintenanceService.IsUnderMaintenanceAsync())
            {
                if (IsAjaxRequest(context.HttpContext.Request))
                {
                    const string text = "{ \"code\": 999999, \"message\": \"Under maintenance time.\" }";
                    context.HttpContext.Response.Clear();
                    context.HttpContext.Response.StatusCode = 503;
                    await context.HttpContext.Response.WriteAsync(text);
                }
                else
                {
                    if (UriHelper.BuildAbsolute(context.HttpContext.Request.Scheme,
                            context.HttpContext.Request.Host, configuration.UMPageUrl) !=
                        context.HttpContext.Request.GetDisplayUrl())
                    {
                        context.Result = new RedirectResult(configuration.UMPageUrl, true);
                    }
                }
            }
            base.OnActionExecuting(context);
        }

        public static bool IsAjaxRequest(HttpRequest request) =>
            string.Equals(request.Query["X-Requested-With"], "XMLHttpRequest", StringComparison.Ordinal)
            || string.Equals(request.Headers["X-Requested-With"], "XMLHttpRequest", StringComparison.Ordinal);
    }
}