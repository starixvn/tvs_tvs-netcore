using System;
using System.Text;
using System.Text.Json;
using TicketVoidingSystem.Web.JsonConverter;
using Xunit;

namespace TicketVoidingSystem.Tests.Web.JsonConverter;

public class DecimalWithoutTrailingZerosJsonConverterTests
{
    private readonly JsonSerializerOptions _options;

    public DecimalWithoutTrailingZerosJsonConverterTests()
    {
        _options = new JsonSerializerOptions
        {
            Converters = { new DecimalWithoutTrailingZerosJsonConverter() }
        };
    }

    #region Read Tests

    [Fact]
    public void Read_FromJsonNumber_WithTrailingZeros_RemovesTrailingZeros()
    {
        // Arrange
        var json = "123.4500";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        var result = converter.Read(ref reader, typeof(decimal), _options);

        // Assert
        Assert.Equal(123.45m, result);
    }

    [Fact]
    public void Read_FromJsonNumber_WithoutTrailingZeros_ReturnsSameValue()
    {
        // Arrange
        var json = "123.45";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        var result = converter.Read(ref reader, typeof(decimal), _options);

        // Assert
        Assert.Equal(123.45m, result);
    }

    [Fact]
    public void Read_FromJsonString_WithTrailingZeros_RemovesTrailingZeros()
    {
        // Arrange
        var json = "\"123.4500\"";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        var result = converter.Read(ref reader, typeof(decimal), _options);

        // Assert
        Assert.Equal(123.45m, result);
    }

    [Fact]
    public void Read_FromJsonString_WithoutTrailingZeros_ReturnsSameValue()
    {
        // Arrange
        var json = "\"123.45\"";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        var result = converter.Read(ref reader, typeof(decimal), _options);

        // Assert
        Assert.Equal(123.45m, result);
    }

    [Fact]
    public void Read_FromJsonString_InvalidString_ReturnsDefault()
    {
        // Arrange
        var json = "\"invalid\"";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        var result = converter.Read(ref reader, typeof(decimal), _options);

        // Assert
        Assert.Equal(0m, result);
    }

    [Fact]
    public void Read_FromJsonNumber_IntegerValue_ReturnsInteger()
    {
        // Arrange
        var json = "100";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        var result = converter.Read(ref reader, typeof(decimal), _options);

        // Assert
        Assert.Equal(100m, result);
    }

    [Fact]
    public void Read_FromJsonNumber_Zero_ReturnsZero()
    {
        // Arrange
        var json = "0";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        var result = converter.Read(ref reader, typeof(decimal), _options);

        // Assert
        Assert.Equal(0m, result);
    }

    [Fact]
    public void Read_FromJsonNumber_NegativeValue_RemovesTrailingZeros()
    {
        // Arrange
        var json = "-123.4500";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        var result = converter.Read(ref reader, typeof(decimal), _options);

        // Assert
        Assert.Equal(-123.45m, result);
    }

    [Fact]
    public void Read_InvalidTokenType_ThrowsJsonException()
    {
        // Arrange
        var json = "true";
        var bytes = Encoding.UTF8.GetBytes(json);
        var reader = new Utf8JsonReader(bytes);
        reader.Read();
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act & Assert
        JsonException exception = null;
        try
        {
            converter.Read(ref reader, typeof(decimal), _options);
        }
        catch (JsonException ex)
        {
            exception = ex;
        }

        Assert.NotNull(exception);
    }

    #endregion

    #region Write Tests

    [Fact]
    public void Write_DecimalWithTrailingZeros_RemovesTrailingZeros()
    {
        // Arrange
        var value = 123.4500m;
        using var stream = new System.IO.MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        converter.Write(writer, value, _options);
        writer.Flush();

        // Assert
        var json = Encoding.UTF8.GetString(stream.ToArray());
        Assert.Equal("123.45", json);
    }

    [Fact]
    public void Write_DecimalWithoutTrailingZeros_ReturnsSameValue()
    {
        // Arrange
        var value = 123.45m;
        using var stream = new System.IO.MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        converter.Write(writer, value, _options);
        writer.Flush();

        // Assert
        var json = Encoding.UTF8.GetString(stream.ToArray());
        Assert.Equal("123.45", json);
    }

    [Fact]
    public void Write_Zero_ReturnsZero()
    {
        // Arrange
        var value = 0m;
        using var stream = new System.IO.MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        converter.Write(writer, value, _options);
        writer.Flush();

        // Assert
        var json = Encoding.UTF8.GetString(stream.ToArray());
        Assert.Equal("0", json);
    }

    [Fact]
    public void Write_NegativeDecimal_RemovesTrailingZeros()
    {
        // Arrange
        var value = -123.4500m;
        using var stream = new System.IO.MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        converter.Write(writer, value, _options);
        writer.Flush();

        // Assert
        var json = Encoding.UTF8.GetString(stream.ToArray());
        Assert.Equal("-123.45", json);
    }

    [Fact]
    public void Write_IntegerDecimal_ReturnsInteger()
    {
        // Arrange
        var value = 100m;
        using var stream = new System.IO.MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        converter.Write(writer, value, _options);
        writer.Flush();

        // Assert
        var json = Encoding.UTF8.GetString(stream.ToArray());
        Assert.Equal("100", json);
    }

    [Fact]
    public void Write_LargeDecimal_RemovesTrailingZeros()
    {
        // Arrange
        var value = 123456789.123000m;
        using var stream = new System.IO.MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        converter.Write(writer, value, _options);
        writer.Flush();

        // Assert
        var json = Encoding.UTF8.GetString(stream.ToArray());
        Assert.Equal("123456789.123", json);
    }

    [Fact]
    public void Write_SmallDecimal_RemovesTrailingZeros()
    {
        // Arrange
        var value = 0.001000m;
        using var stream = new System.IO.MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        var converter = new DecimalWithoutTrailingZerosJsonConverter();

        // Act
        converter.Write(writer, value, _options);
        writer.Flush();

        // Assert
        var json = Encoding.UTF8.GetString(stream.ToArray());
        Assert.Equal("0.001", json);
    }

    #endregion

    #region Integration Tests

    [Fact]
    public void Serialize_ObjectWithDecimalProperty_RemovesTrailingZeros()
    {
        // Arrange
        var obj = new { Value = 123.4500m };
        var expectedJson = "{\"Value\":123.45}";

        // Act
        var json = JsonSerializer.Serialize(obj, _options);

        // Assert
        Assert.Equal(expectedJson, json);
    }

    [Fact]
    public void Deserialize_JsonWithDecimalProperty_RemovesTrailingZeros()
    {
        // Arrange
        var json = "{\"Value\":123.4500}";
        var expectedValue = 123.45m;

        // Act
        var obj = JsonSerializer.Deserialize<TestModel>(json, _options);

        // Assert
        Assert.NotNull(obj);
        Assert.Equal(expectedValue, obj.Value);
    }

    [Fact]
    public void RoundTrip_SerializeAndDeserialize_PreservesValue()
    {
        // Arrange
        var originalValue = 123.4500m;
        var obj = new TestModel { Value = originalValue };

        // Act
        var json = JsonSerializer.Serialize(obj, _options);
        var deserialized = JsonSerializer.Deserialize<TestModel>(json, _options);

        // Assert
        Assert.NotNull(deserialized);
        Assert.Equal(123.45m, deserialized.Value);
        Assert.DoesNotContain("123.4500", json);
        Assert.Contains("123.45", json);
    }

    private class TestModel
    {
        public decimal Value { get; set; }
    }

    #endregion
}

