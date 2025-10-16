using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace TicketVoidingSystem.Utilities;

public static class HttpContextHelper
{
    public static string ExtraLog => "extra-log";

    private static IHttpContextAccessor? _accessor;

    public static void Configure(IHttpContextAccessor accessor) => _accessor = accessor;

    public static HttpContext? Current => _accessor?.HttpContext;

    public static void SetExtraLog(string name, object objectValue)
    {
        if (Current != null)
        {
            var logModel = new
            {
                Name = name,
                Value = objectValue
            };

            Current.Items[ExtraLog] = JsonSerializer.Serialize(logModel);
        }
    }

    public static object? GetExtraLog()
    {
        return Current?.Items.TryGetValue(ExtraLog, out var value) == true ? value : null;
    }
}