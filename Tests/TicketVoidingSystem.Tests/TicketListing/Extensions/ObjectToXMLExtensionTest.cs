using System.Collections.Generic;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.TicketListing.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Extensions;

public class ObjectToXMLExtensionTest
{
    [Fact]
    public void ToAffectTicketsXml_ReturnXML()
    {
        // Arrange
        const string expected = "<root><r tid='1' /></root>";
        var betIds = new List<BetId>
        {
            new() { TransId = "1", SiteDbGroupId = 0 }
        };

        // Act
        var actual = betIds.ToAffectTicketsXml();

        // Assert
        Assert.Equal(expected, actual);
    }
}