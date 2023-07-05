using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions
{
    public class StringExtensionTests
    {
        [Fact]
        public void XmlToJson_ValidXmlProvided_ConvertXmlToJson()
        {
            // Arrange
            string xml = "<root><name>John</name><age>30</age></root>";

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
            string xml = "<Person><Name>John</Name><Age>30</Age></Person>";

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
            string xml = "";

            // Act
            var result = xml.ParseXmlToObject<Person>();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(default, result.Name);
            Assert.Equal(default, result.Age);
        }

        public class Person
        {
            public string Name { get; set; }
            public int Age { get; set; }
        }

    }
}
