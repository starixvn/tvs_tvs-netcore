using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Fanex.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TicketVoidingSystem.Web;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class LogActionFilterAttribute(ILogger logger) : ActionFilterAttribute
{
    private readonly List<string> excludePatterns = ["^.*/Auth.*$", "^.*/healthcheck.*$", "^.*recheckin.*$"];

    public override async void OnActionExecuting(ActionExecutingContext context)
    {
        var httpContext = context.HttpContext;
        if (await IsSkipAction(context.ActionDescriptor, httpContext))
        {
            return;
        }

        var requestMethod = httpContext.Request.Method;
        var stringBuilder = new StringBuilder();
        stringBuilder.AppendLine($"{requestMethod}-{httpContext.Request.GetDisplayUrl()} - {httpContext.User.Identity?.Name} - {DateTimeOffset.Now:MM/dd/yyyy-HH/mm/ss}");
        stringBuilder.AppendLine($"UserAgent: {httpContext.Request.Headers["User-Agent"]}");
        stringBuilder.AppendLine($"Params: {JsonSerializer.Serialize(context.ActionArguments)}");

        httpContext.Items["request-log"] = stringBuilder.ToString();
        httpContext.Items["timer"] = Stopwatch.StartNew();
        base.OnActionExecuting(context);
    }

    private async ValueTask<bool> IsSkipAction(ActionDescriptor actionDescriptor, HttpContext httpContext)
    {
        if (actionDescriptor is not ControllerActionDescriptor descriptor)
        {
            return false;
        }

        var attrsInAction = descriptor.MethodInfo.GetCustomAttributes(typeof(SkipLoggingAttribute), true);
        var attrsInController =
            descriptor.ControllerTypeInfo.GetCustomAttributes(typeof(SkipLoggingAttribute), true);

        return attrsInAction.Any() || attrsInController.Any() || await IsExcluded(httpContext.Request.GetDisplayUrl());
    }

    public override async void OnActionExecuted(ActionExecutedContext context)
    {
        var httpContext = context.HttpContext;
        if (await IsSkipAction(context.ActionDescriptor, httpContext))
        {
            return;
        }

        var sw = httpContext.Items["timer"] as Stopwatch;
        var requestLog = httpContext.Items["request-log"] as string;
        var responseData = context.Result switch
        {
            OkObjectResult okObjectResult => JsonSerializer.Serialize(okObjectResult.Value),
            JsonResult jsonResult => JsonSerializer.Serialize(jsonResult.Value),
            _ => string.Empty
        };
        var stringBuilder = new StringBuilder();
        stringBuilder.Append(requestLog);
        stringBuilder.AppendLine("=============================================");
        stringBuilder.AppendLine($"End Time: {DateTimeOffset.Now:MM/dd/yyyy HH:mm:ss}");
        stringBuilder.AppendLine($"Execution Time: {sw?.ElapsedMilliseconds} ms");
        stringBuilder.AppendLine($"Response: {responseData}");
        stringBuilder.AppendLine($"GUID: {Guid.NewGuid()}");
        await logger.InfoAsync(stringBuilder.ToString());

        base.OnActionExecuted(context);
    }

    private async ValueTask<bool> IsExcluded(string url)
    {
        try
        {
            return excludePatterns.Exists(pattern => new Regex(pattern, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(100)).IsMatch(url));
        }
        catch (Exception ex)
        {
            await logger.InfoAsync(ex.Message);
            return true;
        }
    }
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class SkipLoggingAttribute : Attribute;