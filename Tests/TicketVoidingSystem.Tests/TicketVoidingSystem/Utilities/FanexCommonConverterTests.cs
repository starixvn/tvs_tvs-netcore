using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Utilities;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Utilities;

public class FanexCommonConverterTests
{
    [Theory]
    [InlineData("123.45", 123.45)]
    [InlineData("invalid", 0)]
    [InlineData(null, 0)]
    [InlineData("", 0)]
    public void ToDecimal_ValidAndInvalidInputs_ReturnsExpectedResult(object input, decimal expected)
    {
        // Act
        var result = FanexCommonConverter.ToDecimal(input);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ConvertToXml_ValidObject_ReturnsExpectedXml()
    {
        // Arrange
        var root = new Root<MaxPayoutModel>
        {
            Rows =
            [
                new MaxPayoutModel { TransId = 100 },
                new MaxPayoutModel { TransId = 200 }
            ]
        };
        const string expectedXml = "<root xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=" +
                                   "\"http://www.w3.org/2001/XMLSchema\"><r><a1>0</a1><a2>0</a2><a3>0</a3><a4>0</a4><a6>0</a6><a7>" +
                                   "0</a7><a8>0</a8><a12>0</a12><a13>0001-01-01T00:00:00</a13><a16>0</a16><a17>100</a17></r><r><a1>0</a1>" +
                                   "<a2>0</a2><a3>0</a3><a4>0</a4><a6>0</a6><a7>0</a7><a8>0</a8><a12>0</a12><a13>0001-01-01T00:00:00</a13>" +
                                   "<a16>0</a16><a17>200</a17></r></root>";

        // Act
        var result = FanexCommonConverter.ConvertToXml(root);

        // Assert
        Assert.Equal(expectedXml, result);
    }
}