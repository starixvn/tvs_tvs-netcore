using System.Text.Encodings.Web;
using System.Text.Json;

namespace TicketVoidingSystem.Utilities;

public static class JsonSerializerHelper
{
    public static JsonSerializerOptions UnsafeRelaxedJsonEscaping { get; } = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };
}