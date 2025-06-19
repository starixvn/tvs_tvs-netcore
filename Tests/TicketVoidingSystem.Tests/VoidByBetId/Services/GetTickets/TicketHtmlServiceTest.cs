using System;
using System.ComponentModel;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.GetTickets;

[Category("VoidByBetId")]
public class TicketHtmlServiceTest
{
    private static TicketServiceImp CreateService()
    {
        var betListCoreService = Substitute.For<BetListCoreService>();
        betListCoreService.Create(Arg.Any<GetTicketModel>(), ChoiceType.Html)
            .Returns(new TicketViewModel());
        var conditionService = Substitute.For<ConditionService>();
        return new TicketServiceImp(betListCoreService, conditionService);
    }

    [Fact]
    public void GetTicket_ValidTransDateAndTransId_IncludeTransIdIntoTransDate()
    {
        // Arrange
        const string expected = "06/01/2017 12:40:50 PM";
        var item = new GetTicketModel { TransId = 123, TransDate = new DateTime(2017, 6, 1, 12, 40, 50) };
        var permission = new UserPermission { SettledTicket = true, UnSettledTicket = false };
        var service = CreateService();

        // Act
        var ticket = service.GetTicket(item, permission);

        // Assert
        Assert.Equal(expected, ticket.TransDate);
    }

    [Theory]
    [InlineData(TicketStatus.Running, true, "-")]
    [InlineData(TicketStatus.Running, false, "-")]
    [InlineData(TicketStatus.Won, true, "1.98")]
    [InlineData(TicketStatus.Won, false, "1.98<br>0.3")]
    public void GetTicket_CheckStatusAndHideCommission_DisplayWinLoss(string status, bool isHideComm, string expected)
    {
        // Arrange
        var item = new GetTicketModel
        {
            Status = status,
            WinLost = "1.98",
            IsHideComm = isHideComm,
            Commission = 0.3m
        };
        var betListCoreService = Substitute.For<BetListCoreService>();
        betListCoreService.Create(Arg.Any<GetTicketModel>(), ChoiceType.None)
            .Returns(new TicketViewModel());
        var conditionService = Substitute.For<ConditionService>();
        var service = new TicketServiceImp(betListCoreService, conditionService);

        // Act
        var ticket = service.GetTicket(item, ChoiceType.None);

        // Assert
        Assert.Equal(expected, ticket.WinLoss);
    }

    [Theory]
    [InlineData("", "ABC", "ABC")]
    [InlineData("XYZ", "ABC", "ABC<br>(Follow: XYZ)")]
    public void GetVoidedTicketDetail_HasFollowedUser_AppendFollowedUserToUser(string followedUser, string user, string expected)
    {
        // Arrange
        var ticket = new GetTicketModel
        {
            FollowedUserName = followedUser,
            UserName = user
        };
        var service = CreateService();

        // Act
        var actual = service.GetTicket(ticket, ChoiceType.Html);

        // Assert
        Assert.Equal(expected, actual.Member);
    }

    [Theory]
    [InlineData(0, 123, "123")]
    [InlineData(456, 123, "123<br>(Follow: 456)")]
    public void Render_CheckFollowedId_AppendFollowedIdIntoBetId(long followedId, long transId, string expected)
    {
        // Arrange
        var ticket = new GetTicketModel
        {
            TransId = transId,
            FollowedId = followedId
        };
        var service = CreateService();

        // Act
        var actual = service.GetTicket(ticket, ChoiceType.Html);

        // Assert
        Assert.Equal(expected, actual.BetId);
    }
}