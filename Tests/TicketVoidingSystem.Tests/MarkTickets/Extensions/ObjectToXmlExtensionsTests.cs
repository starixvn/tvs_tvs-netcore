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

        // Act
        var actual = ((List<MarkedMatchXmlModel>)null).ToMarkedMatchXml();

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

        // Act
        var actual = ((List<string>)null).ToTransIdsXml();

        // Assert
        Assert.Equal(string.Empty, actual);
    }

    [Fact]
    public void ToXml_HasListOfString_ReturnsEmpty()
    {
        // Arrange
        var expected = $"<Tickets><Ticket Id='1'/>{Environment.NewLine}<Ticket Id='2'/>{Environment.NewLine}<Ticket Id='3'/></Tickets>";
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

        // Act
        var actual = ((List<TransInfoAutoUnmarkModel>)null).ToTransInfoXml();

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