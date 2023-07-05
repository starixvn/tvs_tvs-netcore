using System;
using System.Collections.Generic;
using System.Text;
using NSubstitute;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.Extensions;

public class EmailExtensionTests
{
    [Fact]
    public void ToOperatorsXml_ReturnsEmptyString_WhenAgentIdsIsNull()
    {
        // Arrange
        IEnumerable<int> agentIds = null;

        // Act
        var result = agentIds.ToOperatorsXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ToOperatorsXml_ReturnsEmptyString_WhenAgentIdsIsEmpty()
    {
        // Arrange
        IEnumerable<int> agentIds = new List<int>();

        // Act
        var result = agentIds.ToOperatorsXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ToOperatorsXml_ReturnsXmlString_WhenAgentIdsHasValues()
    {
        // Arrange
        IEnumerable<int> agentIds = new List<int> { 1, 2, 3 };
        var stringBuilder = new StringBuilder();
        stringBuilder.AppendLine("<Operator AgentId='1' />");
        stringBuilder.AppendLine("<Operator AgentId='2' />");
        stringBuilder.AppendLine("<Operator AgentId='3' />");
        var expected = $"<Operators>{stringBuilder.ToString().Trim()}</Operators>";

        // Act
        var result = agentIds.ToOperatorsXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void GetNegativeBalanceUsers_ReturnsEmptyString_WhenGroupIsCashOut()
    {
        // Arrange
        var tickets = Substitute.For<IEnumerable<TicketEmailModel>>();
        const EmailGroup group = EmailGroup.CashOut;
        var filter = Substitute.For<Func<TicketEmailModel, string>>();
        const string negativeBalanceUsers = "User1,User2,User3";

        // Act
        var result = tickets.GetNegativeBalanceUsers(group, filter, negativeBalanceUsers);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetNegativeBalanceUsers_ReturnsIntersectedUsers_WhenGroupIsNotCashOut()
    {
        // Arrange
        IEnumerable<TicketEmailModel> tickets = new List<TicketEmailModel>
        {
            new() { UserName = "User1" },
            new() { UserName = "User2" },
            new() { UserName = "User3" }
        };
        const EmailGroup group = EmailGroup.ItSupport;
        Func<TicketEmailModel, string> filter = ticket => ticket.UserName;
        const string negativeBalanceUsers = "User2,User4";

        // Act
        var result = tickets.GetNegativeBalanceUsers(group, filter, negativeBalanceUsers);

        // Assert
        Assert.Equal("User2", result);
    }

    [Fact]
    public void Valid_ReturnsFalse_WhenTicketsIsEmpty_AndSiteToListIsNullOrEmpty()
    {
        // Arrange
        IEnumerable<TicketEmailModel> tickets = new List<TicketEmailModel>();
        var site = new SiteEmail { ToList = string.Empty };

        // Act
        var result = tickets.Valid(site);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void Valid_ReturnsTrue_WhenTicketsIsNotEmpty_AndSiteToListIsNotNullOrEmpty()
    {
        // Arrange
        IEnumerable<TicketEmailModel> tickets = new List<TicketEmailModel> { new() };
        var site = new SiteEmail { ToList = "test@example.com" };

        // Act
        var result = tickets.Valid(site);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void JoinSites_ReturnsEmptyString_WhenTicketsIsEmpty()
    {
        // Arrange
        IEnumerable<string> tickets = new List<string>();
        var filter = Substitute.For<Func<string, string>>();

        // Act
        var result = tickets.JoinSites(filter);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void JoinSites_ReturnsDistinctJoinedString_WhenTicketsHasValues()
    {
        // Arrange
        IEnumerable<string> tickets = new List<string> { "Site1", "Site2", "Site1", "Site3" };
        Func<string, string> filter = site => site;

        // Act
        var result = tickets.JoinSites(filter);

        // Assert
        Assert.Equal("Site1, Site2, Site3", result);
    }
}