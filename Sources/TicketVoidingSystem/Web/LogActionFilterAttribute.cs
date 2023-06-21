using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Fanex.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TicketVoidingSystem.Web;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class LogActionFilterAttribute : ActionFilterAttribute
{
    private readonly List<string> excludePatterns = new() { "^.*/Auth.*$", "^.*/healthcheck.*$", "^.*recheckin.*$" };
    private readonly ILogger logger;

    public LogActionFilterAttribute(ILogger logger)
    {
        this.logger = logger;
    }

    public override async void OnActionExecuting(ActionExecutingContext context)
    {
        var httpContext = context.HttpContext;
        if (IsSkipAction(context.ActionDescriptor, httpContext))
        {
            return;
        }

        var requestMethod = httpContext.Request.Method;
        var stringBuilder = new StringBuilder();
        stringBuilder.AppendLine($"REQUEST-{requestMethod} URL: {httpContext.Request.GetDisplayUrl()}");
        stringBuilder.AppendLine($"UserAgent: {httpContext.Request.Headers["User-Agent"]}");
        stringBuilder.AppendLine($"Username: {httpContext.User.Identity?.Name}");
        stringBuilder.AppendLine($"Server Time: {DateTime.Now:MM/dd/yyyy HH:mm:ss}");
        stringBuilder.AppendLine($"Params: {JsonSerializer.Serialize(context.ActionArguments)}");
        stringBuilder.AppendLine($"GUID: {Guid.NewGuid()}");
        await logger.InfoAsync(stringBuilder.ToString());
        httpContext.Items["timer"] = Stopwatch.StartNew();
        base.OnActionExecuting(context);
    }

    private bool IsSkipAction(ActionDescriptor actionDescriptor, HttpContext httpContext)
    {
        if (actionDescriptor is ControllerActionDescriptor descriptor)
        {
            var attrsInAction = descriptor.MethodInfo.GetCustomAttributes(typeof(SkipLoggingAttribute), true);
            var attrsInController =
                descriptor.ControllerTypeInfo.GetCustomAttributes(typeof(SkipLoggingAttribute), true);

            if (attrsInAction.Any() || attrsInController.Any() || IsExcluded(httpContext.Request.GetDisplayUrl()))
            {
                return true;
            }
        }
        return false;
    }

    public override async void OnActionExecuted(ActionExecutedContext context)
    {
        var httpContext = context.HttpContext;
        if (IsSkipAction(context.ActionDescriptor, httpContext))
        {
            return;
        }

        var sw = httpContext.Items["timer"] as Stopwatch;
        var responseData = context.Result is OkObjectResult objectResult ? JsonSerializer.Serialize(objectResult.Value) : string.Empty;
        var stringBuilder = new StringBuilder();
        stringBuilder.AppendLine($"RESPONSE URL: {httpContext.Request.GetDisplayUrl()}");
        stringBuilder.AppendLine($"Username: {httpContext.User.Identity?.Name}");
        stringBuilder.AppendLine($"Server Time: {DateTime.Now:MM/dd/yyyy HH:mm:ss}");
        stringBuilder.AppendLine($"Execution Time: {sw?.ElapsedMilliseconds} ms");
        stringBuilder.AppendLine($"Response: {responseData}");
        stringBuilder.AppendLine($"GUID: {Guid.NewGuid()}");
        await logger.InfoAsync(stringBuilder.ToString());

        base.OnActionExecuted(context);
    }

    private bool IsExcluded(string url)
    {
        return excludePatterns.Any(pattern => new Regex(pattern, RegexOptions.IgnoreCase).IsMatch(url));
    }
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class SkipLoggingAttribute : Attribute
{
}