using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace TicketVoidingSystem.Web.JsonConverter;

public class DecimalWithoutTrailingZerosJsonConverter : JsonConverter<decimal>
{
    /// <summary>
    /// Normalizes a decimal by removing trailing zeros.
    /// Uses "G29" format which is the most precise general format for decimal.
    /// </summary>
    private static decimal NormalizeDecimal(decimal value)
    {
        // Use "G29" format which removes trailing zeros and uses the most compact representation
        // Then parse back to ensure the decimal scale is normalized
        var normalizedString = value.ToString("G29", CultureInfo.InvariantCulture);
        if (decimal.TryParse(normalizedString, NumberStyles.Any, CultureInfo.InvariantCulture, out var normalizedValue))
        {
            return normalizedValue;
        }
        return value;
    }

    public override decimal Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        decimal value;
        switch (reader.TokenType)
        {
            case JsonTokenType.String:
                {
                    var stringValue = reader.GetString();
                    if (!decimal.TryParse(stringValue, NumberStyles.Any, CultureInfo.InvariantCulture, out value))
                    {
                        return default;
                    }
                    break;
                }
            case JsonTokenType.Number when reader.TryGetDecimal(out var number):
                value = number;
                break;

            case JsonTokenType.Number:
                return default;

            default:
                throw new JsonException();
        }

        // Normalize decimal to remove trailing zeros
        return NormalizeDecimal(value);
    }

    public override void Write(Utf8JsonWriter writer, decimal value, JsonSerializerOptions options)
    {
        // Normalize decimal first to ensure no trailing zeros
        var normalizedValue = NormalizeDecimal(value);
        
        // Convert to string using "G29" format to remove trailing zeros
        var normalizedString = normalizedValue.ToString("G29", CultureInfo.InvariantCulture);
        
        // Write as raw JSON number value to preserve the normalized format
        writer.WriteRawValue(normalizedString);
    }
}

