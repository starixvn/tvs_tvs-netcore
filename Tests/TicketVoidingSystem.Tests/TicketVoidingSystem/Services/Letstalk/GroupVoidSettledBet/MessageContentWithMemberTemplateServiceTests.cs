using System;
using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public class MessageContentWithMemberTemplateServiceTests
{
    private readonly MessageContentWithMemberTemplateServiceImp service;
    private readonly UusTicketService uusTicketService;

    public MessageContentWithMemberTemplateServiceTests()
    {
        uusTicketService = Substitute.For<UusTicketService>();
        service = new MessageContentWithMemberTemplateServiceImp(uusTicketService);
    }

    [Fact]
    public void Create_NoValidTickets_ReturnEmptyList()
    {
        // Arrange
        var model = new TicketInfoForLetstalk();
        var tickets = new List<TicketEmailModel>();

        // Act
        var result = service.Create(model, tickets);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void Create_ValidTickets_ReturnCorrectMessage()
    {
        // Arrange
        var model = new TicketInfoForLetstalk
        {
            Match = new Match
            {
                MatchId = 123,
                EventDate = new DateTime(2022, 1, 1, 1, 1, 1),
                KickOffTime = new DateTime(2022, 1, 1, 1, 1, 2),
                LeagueName = "Premier League",
                HomeName = "Team A",
                AwayName = "Team B",
                AwayId = 456
            },
            UserName = "John Doe",
            VoidFromTime = new DateTime(2022, 1, 1, 1, 1, 3).ToString("dd MM yyyy"),
            VoidToTime = new DateTime(2022, 1, 1, 1, 1, 4).ToString("dd MM yyyy")
        };
        var countInfo = new TicketCountInfo
        {
            SingleCount = 1,
            InstantOUCount = 1,
            CashOutCount = 2,
            ParlayCount = 2,
            OutstandingSingleCount = 1,
            OutstandingParlayCount = 1
        };

        var tickets = new List<TicketEmailModel>
        {
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = true, UserName = "UserName",
                Status = TicketStatus.Running, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "UserName",
                Status = TicketStatus.Running, BetTypeId = 1
            }
        };
        const string userNames = "Username: ";
        var content = $"Void Date: {model.VoidFromDate} - {model.VoidToDate}{Environment.NewLine}"
                      + $"Voided by: {model.UserName}"
                      + $"(Settled ticket: Single Count: {countInfo.SingleCount}, Instant OU: {countInfo.InstantOUCount}"
                      + $", Cash Out: {countInfo.CashOutCount}, Parlay Count: {countInfo.ParlayCount}{Environment.NewLine}"
                      + $"Outstanding: Single Count: {countInfo.OutstandingSingleCount}, Parlay Count: {countInfo.OutstandingParlayCount}){Environment.NewLine}";
        var expected = $"{content}{userNames}";

        uusTicketService.IsValidSettledSingleTicket(Arg.Any<TicketEmailModel>()).Returns(true);
        uusTicketService.IsValidSettledParlayTicket(Arg.Any<TicketEmailModel>(), Arg.Any<bool>()).Returns(true);
        uusTicketService.IsValidCashOut(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(true);

        // Act
        var result = service.Create(model, tickets);

        // Assert
        Assert.Equal(expected, result.ToList()[0]);
    }

    [Fact]
    public void Create_HasContentBiggerMaxContent_ReturnResultHasMoreOneValue()
    {
        // Arrange
        var model = new TicketInfoForLetstalk
        {
            Match = new Match
            {
                MatchId = 123,
                EventDate = new DateTime(2022, 1, 1, 1, 1, 1),
                KickOffTime = new DateTime(2022, 1, 1, 1, 1, 2),
                LeagueName = "Premier League",
                HomeName = "Team A",
                AwayName = "Team B",
                AwayId = 456
            },
            UserName = "John Doe",
            VoidFromTime = new DateTime(2022, 1, 1, 1, 1, 3).ToString("dd MM yyyy"),
            VoidToTime = new DateTime(2022, 1, 1, 1, 1, 4).ToString("dd MM yyyy")
        };

        var tickets = new List<TicketEmailModel>
        {
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxUserName1",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxYxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName2",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxUserName3",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxYxxxxxxxxxxxxUserName4",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxYxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName5",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxYxxxYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName6",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxUserName7",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxUserName8",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxYxxxxxxxxxxxxxxUserName9",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxUserName10",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxUserName11",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxUserName12",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxUserName13",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxUserName14",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxUserName15",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxUserName16",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxUserName17",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxxUserName18",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxUserName19",
                Status = TicketStatus.Draw, BetTypeId = 29
            },
            new()
            {
                IsMixParlay = false, IsInstantSettlementTicket = false,
                UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxUserName20",
                Status = TicketStatus.Draw, BetTypeId = 29
            }
        };

        uusTicketService.IsValidSettledSingleTicket(Arg.Any<TicketEmailModel>()).Returns(true);
        uusTicketService.IsValidSettledParlayTicket(Arg.Any<TicketEmailModel>(), Arg.Any<bool>()).Returns(false);
        uusTicketService.IsValidCashOut(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(false);

        // Act
        var result = service.Create(model, tickets);

        // Assert
        Assert.Equal(2, result.Count);
    }
}