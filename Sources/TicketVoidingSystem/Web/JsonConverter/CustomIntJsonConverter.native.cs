using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace TicketVoidingSystem.Web.JsonConverter;

public class CustomIntJsonConverter : JsonConverter<int?>
{
    public override int? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        switch (reader.TokenType)
        {
            case JsonTokenType.String:
                {
                    var stringValue = reader.GetString();

                    return int.TryParse(stringValue, out var outValue) ? (int?)outValue : default;
                }
            case JsonTokenType.Number when reader.TryGetInt32(out var number):
                return number;

            case JsonTokenType.Number:
                return default;

            default:
                throw new JsonException();
        }
    }

    public override void Write(Utf8JsonWriter writer, int? value, JsonSerializerOptions options)
    {
        if (value == null)
        {
            writer.WriteStringValue(string.Empty);
        }
        else
        {
            writer.WriteNumberValue(value.Value);
        }
    }
}