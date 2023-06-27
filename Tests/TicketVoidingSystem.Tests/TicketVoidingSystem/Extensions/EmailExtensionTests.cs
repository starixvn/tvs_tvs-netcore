using System;
using System.Collections.Generic;
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
        string result = agentIds.ToOperatorsXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ToOperatorsXml_ReturnsEmptyString_WhenAgentIdsIsEmpty()
    {
        // Arrange
        IEnumerable<int> agentIds = new List<int>();

        // Act
        string result = agentIds.ToOperatorsXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void ToOperatorsXml_ReturnsXmlString_WhenAgentIdsHasValues()
    {
        // Arrange
        IEnumerable<int> agentIds = new List<int> { 1, 2, 3 };

        // Act
        string result = agentIds.ToOperatorsXml();

        // Assert
        Assert.Equal("<Operators><Operator AgentId='1' />\r\n<Operator AgentId='2' />\r\n<Operator AgentId='3' /></Operators>", result);
    }

    [Fact]
    public void GetNegativeBalanceUsers_ReturnsEmptyString_WhenGroupIsCashOut()
    {
        // Arrange
        IEnumerable<TicketEmailModel> tickets = Substitute.For<IEnumerable<TicketEmailModel>>();
        EmailGroup group = EmailGroup.CashOut;
        Func<TicketEmailModel, string> filter = Substitute.For<Func<TicketEmailModel, string>>();
        string negativeBalanceUsers = "User1,User2,User3";

        // Act
        string result = tickets.GetNegativeBalanceUsers(group, filter, negativeBalanceUsers);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetNegativeBalanceUsers_ReturnsIntersectedUsers_WhenGroupIsNotCashOut()
    {
        // Arrange
        IEnumerable<TicketEmailModel> tickets = new List<TicketEmailModel>
        {
            new TicketEmailModel { UserName = "User1" },
            new TicketEmailModel { UserName = "User2" },
            new TicketEmailModel { UserName = "User3" }
        };
        EmailGroup group = EmailGroup.ItSupport;
        Func<TicketEmailModel, string> filter = ticket => ticket.UserName;
        string negativeBalanceUsers = "User2,User4";

        // Act
        string result = tickets.GetNegativeBalanceUsers(group, filter, negativeBalanceUsers);

        // Assert
        Assert.Equal("User2", result);
    }

    [Fact]
    public void Valid_ReturnsFalse_WhenTicketsIsEmpty_AndSiteToListIsNullOrEmpty()
    {
        // Arrange
        IEnumerable<TicketEmailModel> tickets = new List<TicketEmailModel>();
        SiteEmail site = new SiteEmail { ToList = string.Empty };

        // Act
        bool result = tickets.Valid(site);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void Valid_ReturnsTrue_WhenTicketsIsNotEmpty_AndSiteToListIsNotNullOrEmpty()
    {
        // Arrange
        IEnumerable<TicketEmailModel> tickets = new List<TicketEmailModel> { new TicketEmailModel() };
        SiteEmail site = new SiteEmail { ToList = "test@example.com" };

        // Act
        bool result = tickets.Valid(site);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void JoinSites_ReturnsEmptyString_WhenTicketsIsEmpty()
    {
        // Arrange
        IEnumerable<string> tickets = new List<string>();
        Func<string, string> filter = Substitute.For<Func<string, string>>();

        // Act
        string result = tickets.JoinSites(filter);

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
        string result = tickets.JoinSites(filter);

        // Assert
        Assert.Equal("Site1, Site2, Site3", result);
    }
}