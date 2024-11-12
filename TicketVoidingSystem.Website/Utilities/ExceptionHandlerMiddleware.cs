using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.Website.Utilities;

public class ExceptionHandlerMiddleware(
    RequestDelegate next,
    IConfiguration configuration,
    LoggingService loggingService)
{
    public IConfiguration Configuration { get; } = configuration;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            await loggingService.HandleException(context, exception);
            await HandleResponseException(context, exception);
        }
    }

    private static async Task HandleResponseException(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        var errorMessage = $"Exception Error: {exception.Message} {exception.StackTrace}";
        await context.Response.WriteAsync(errorMessage).ConfigureAwait(false);
    }
}