using System.Collections.Generic;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.TicketListing.Extensions;
using TicketVoidingSystem.TicketListing.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Extensions;

public class ObjectToXMLExtensionTest
{
    [Fact]
    public void ToResultAmendmentXML_ReturnXML()
    {
        // Arrange
        const string expected = "<root><r TransId='1' CustId='2' /></root>";
        var tickets = new List<ExcelOicModel>
        {
            new() { TransId = 1, CustId = 2 }
        };

        // Act
        var actual = tickets.ToResultAmendmentXML();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToAffectTicketsXml_ReturnXML()
    {
        // Arrange
        const string expected = "<root><r tid='1' /></root>";
        var betIds = new List<BetId>
        {
            new() { TransId = "1", SiteDbGroupId = 0}
        };

        // Act
        var actual = betIds.ToAffectTicketsXml();

        // Assert
        Assert.Equal(expected, actual);
    }
}