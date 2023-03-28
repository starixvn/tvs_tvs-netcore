using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace TicketVoidingSystem.Web.JsonConverter;

public class CustomDateTimeJsonConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        DateTime.TryParse(reader.GetString() ?? string.Empty, CultureInfo.InvariantCulture, out var result);
        return result;
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString("yyyy-MM-dd HH:mm:ss.fff"));
    }
}