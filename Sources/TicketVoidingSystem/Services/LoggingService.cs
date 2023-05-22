using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Logging;
using Fanex.Logging.Extensions;
using Fanex.Logging.Extensions.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;

namespace TicketVoidingSystem.Services;

public interface LoggingService
{
    Task ErrorAsync(string message, Exception exception);

    Task ErrorAsync(string message);

    Task ErrorAsync(Exception exception);

    Task InfoAsync(string message);

    Task HandleException(HttpContext context, Exception exception);
}

public class LoggingServiceImp : LoggingService
{
    public async Task ErrorAsync(string message, Exception exception)
    {
        var logException = new Exception(message, exception);
        await HandleException(logException);
    }

    public async Task ErrorAsync(string message)
    {
        await LogService.ErrorAsync(message);
    }

    public async Task ErrorAsync(Exception exception)
    {
        await HandleException(exception);
    }

    public async Task InfoAsync(string message)
    {
        await LogService.InfoAsync(message);
    }

    public async Task HandleException(HttpContext context, Exception exception)
    {
        var logMessage = new LogMessage(exception.Message)
            .AddSection("Request Info", GetRequestInfo(context))
            .AddSection("Database Info", DatabaseInfoGetters.GetDbExceptionInfo(exception))
            .AddSection("Server Info", CommonInfoGetters.GetServerInfo())
            .AddSection("Exception Info", CommonInfoGetters.GetExceptionInfo(exception.InnerException))
            .ToString();
        await LogService.ErrorAsync(logMessage);
    }

    private static async Task HandleException(Exception exception)
    {
        var logMessage = new LogMessage(exception.Message)
            .AddSection("Database Info", DatabaseInfoGetters.GetDbExceptionInfo(exception))
            .AddSection("Server Info", CommonInfoGetters.GetServerInfo())
            .AddSection("Exception Info", CommonInfoGetters.GetExceptionInfo(exception.InnerException))
            .ToString();
        await LogService.ErrorAsync(logMessage);
    }

    private static Dictionary<string, object> GetRequestInfo(HttpContext context)
    {
        return new Dictionary<string, object>
        {
            { "Url", context.Request.GetDisplayUrl() },
            { "Username", context.User.Identity?.Name },
            { "User IP", context.Request.Headers["X-Forwarded-For"] }
        };
    }
}