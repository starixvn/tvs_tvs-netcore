using System;
using System.Collections.Generic;
using TicketVoidingSystem.MarkTickets.Extensions;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Extensions;

public class ObjectToXmlExtensionsTests
{
    [Fact]
    public void ToXml_NullListOfMarkedMatchXmlModel_ReturnsEmpty()
    {
        // Arrange
        List<MarkedMatchXmlModel>? nullList = null;

        // Act
        var actual = nullList.ToMarkedMatchXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToXml_ListOfMarkedMatchXmlModel_ReturnsFormattedXml()
    {
        // Arrange
        var list = new List<MarkedMatchXmlModel>
        {
            new() { MatchId = 1, UserId = 1, CreatedDate = new DateTime(2000, 1, 1) }
        };

        // Act
        var actual = list.ToMarkedMatchXml();

        // Assert
        Assert.Equal("<Matches><Match MatchId='1' UserId='1' CreatedDate='01/01/2000 00:00:00.000' /></Matches>", actual);
    }

    [Fact]
    public void ToXml_NullListOfString_ReturnsEmpty()
    {
        // Arrange
        List<string>? nullList = null;

        // Act
        var actual = nullList.ToTransIdsXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToXml_HasListOfString_ReturnsEmpty()
    {
        // Arrange
        const string expected = "<Tickets><Ticket Id='1'/>\r\n<Ticket Id='2'/>\r\n<Ticket Id='3'/></Tickets>";
        var transIds = new List<string> { "1", "2", "3" };

        // Act
        var actual = transIds.ToTransIdsXml();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void ToXml_TransInfoAutoUnmarkModelIsNull_ReturnsExpected()
    {
        // Arrange
        List<TransInfoAutoUnmarkModel>? models = null;

        // Act
        var actual = models.ToTransInfoXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToXml_TransInfoAutoUnmarkModelNotNull_ReturnsExpected()
    {
        // Arrange
        const string expected =
            "<root><r mid='0' t='0' btype='0' us='0' crdate='01/01/0001 00:00:00.000' mt='0' bid=''/></root>";
        var models = new List<TransInfoAutoUnmarkModel> { new() };

        // Act
        var actual = models.ToTransInfoXml();

        // Assert
        Assert.Equal(expected, actual);
    }
}