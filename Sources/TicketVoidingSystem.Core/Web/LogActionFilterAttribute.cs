using System;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using Fanex.Logging;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TicketVoidingSystem.Core.Web
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class LogActionFilterAttribute : ActionFilterAttribute
    {
        private readonly ILogger logger;

        public LogActionFilterAttribute(ILogger logger)
        {
            this.logger = logger;
        }

        public override async void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.ActionDescriptor is ControllerActionDescriptor descriptor)
            {
                var attrsInAction = descriptor.MethodInfo.GetCustomAttributes(typeof(SkipLoggingAttribute), true);
                var attrsInController =
                    descriptor.ControllerTypeInfo.GetCustomAttributes(typeof(SkipLoggingAttribute), true);

                if (attrsInAction.Any() || attrsInController.Any())
                {
                    return;
                }
            }

            var httpContext = context.HttpContext;
            var requestMethod = httpContext.Request.Method;

            var stringBuilder = new StringBuilder();
            stringBuilder.AppendLine($"REQUEST-{requestMethod} URL: {httpContext.Request.GetDisplayUrl()}");
            stringBuilder.AppendLine($"UserAgent: {httpContext.Request.Headers["User-Agent"]}");
            stringBuilder.AppendLine($"Username: {httpContext?.User?.Identity?.Name}");
            stringBuilder.AppendLine($"Server Time: {DateTime.Now:MM/dd/yyyy HH:mm:ss}");
            stringBuilder.AppendLine($"Params: {JsonSerializer.Serialize(context.ActionArguments)}");
            stringBuilder.AppendLine($"GUID: {Guid.NewGuid()}");
            await logger.InfoAsync(stringBuilder.ToString());
            httpContext.Items["timer"] = Stopwatch.StartNew();
            base.OnActionExecuting(context);
        }

        public override async void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.ActionDescriptor is ControllerActionDescriptor descriptor)
            {
                var attrsInAction = descriptor.MethodInfo.GetCustomAttributes(typeof(SkipLoggingAttribute), true);
                var attrsInController =
                    descriptor.ControllerTypeInfo.GetCustomAttributes(typeof(SkipLoggingAttribute), true);

                if (attrsInAction.Any() || attrsInController.Any())
                {
                    return;
                }
            }

            var httpContext = context.HttpContext;
            var sw = httpContext.Items["timer"] as Stopwatch;
            var responseData = (context.Result is OkObjectResult objectResult) ? JsonSerializer.Serialize(objectResult.Value) : string.Empty;
            var stringBuilder = new StringBuilder();
            stringBuilder.AppendLine($"RESPONSE URL: {httpContext.Request.GetDisplayUrl()}");
            stringBuilder.AppendLine($"Username: {httpContext?.User?.Identity?.Name}");
            stringBuilder.AppendLine($"Server Time: {DateTime.Now:MM/dd/yyyy HH:mm:ss}");
            stringBuilder.AppendLine($"Execution Time: {sw?.ElapsedMilliseconds} ms");
            stringBuilder.AppendLine($"Response: {responseData}");
            stringBuilder.AppendLine($"GUID: {Guid.NewGuid()}");
            await logger.InfoAsync(stringBuilder.ToString());

            base.OnActionExecuted(context);
        }
    }

    public class SkipLoggingAttribute : Attribute
    {
    }
}