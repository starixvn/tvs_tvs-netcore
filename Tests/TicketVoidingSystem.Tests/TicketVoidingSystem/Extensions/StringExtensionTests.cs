using System.Collections.Generic;
using System.Text.Json.Serialization;
using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

public class StringExtensionTests
{
    private class Person
    {
        [JsonPropertyName("n")]
        public string Name { get; set; }

        [JsonPropertyName("a")]
        public int Age { get; set; }
    }

    [Fact]
    public void XmlToJson_ValidXmlProvided_ConvertXmlToJson()
    {
        // Arrange
        const string xml = "<root><name>John</name><age>30</age></root>";

        // Act
        var result = xml.XmlToJson<dynamic>();

        // Assert
        Assert.Equal("John", result.root.name.Value);
        Assert.Equal("30", result.root.age.Value);
    }

    [Fact]
    public void ParseXmlToObject_ValidXmlProvided_DeserializeXmlToObject()
    {
        // Arrange
        const string xml = "<Person><Name>John</Name><Age>30</Age></Person>";

        // Act
        var result = xml.ParseXmlToObject<Person>();

        // Assert
        Assert.NotNull(result);
        Assert.Equal("John", result.Name);
        Assert.Equal(30, result.Age);
    }

    [Fact]
    public void ParseXmlToObject_EmptyXmlProvided_ReturnDefaultObject()
    {
        // Arrange
        const string xml = "";

        // Act
        var result = xml.ParseXmlToObject<Person>();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(default, result.Name);
        Assert.Equal(default, result.Age);
    }

    [Fact]
    public void ToJson_ValidList_ReturnsCorrectJson()
    {
        // Arrange
        var list = new List<Person>
        {
            new() { Name = "Test1", Age = 10},
            new() { Name = "Test2", Age = 11}
        };
        var expectedJson = "[{\"n\":\"Test1\",\"a\":10},{\"n\":\"Test2\",\"a\":11}]";

        // Act
        var result = list.ToJson();

        // Assert
        Assert.Equal(expectedJson, result);
    }

    [Fact]
    public void ToJson_NullList_ReturnsEmptyString()
    {
        // Arrange
        List<Person> list = null;

        // Act
        var result = list.ToJson();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ToJson_EmptyList_ReturnsEmptyString()
    {
        // Arrange
        var list = new List<Person>();

        // Act
        var result = list.ToJson();

        // Assert
        Assert.Equal(string.Empty, result);
    }
}