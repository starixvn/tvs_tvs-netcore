using Xunit;
using NSubstitute;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using System.Collections.Generic;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using System;
using TicketVoidingSystem.Models;
using System.Linq;
using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet
{
    public class MessageContentWithMemberTemplateServiceTests
    {
        private const int MaxContent = 1024;
        private readonly UusTicketService uusTicketService;
        private readonly MessageContentWithMemberTemplateServiceImp service;

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
                VoidFromTime = new DateTime(2022, 1, 1, 1, 1, 3).ToString("dd MMMM yyyy"),
                VoidToTime = new DateTime(2022, 1, 1, 1, 1, 4).ToString()
            };
            var countInfo = new TicketCountInfo
            {
                SingleCount = 1,
                InstantOUCount = 1,
                CashOutCount = 2,
                ParlayCount = 2,
                OutstandingSingleCount = 1,
                OutstandingParlayCount = 1,
            };

            var tickets = new List<TicketEmailModel>
            {
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = true, UserName = "UserName", Status = TicketStatus.Running, BetTypeId = 29 },
                new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "UserName", Status = TicketStatus.Running, BetTypeId = 1 },

    };
            var userNames = $"Username: ";
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
                VoidFromTime = new DateTime(2022, 1, 1, 1, 1, 3).ToString("dd MMMM yyyy"),
                VoidToTime = new DateTime(2022, 1, 1, 1, 1, 4).ToString()
            };
            var countInfo = new TicketCountInfo
            {
                SingleCount = 7,
                InstantOUCount = 0,
                CashOutCount = 0,
                ParlayCount = 0,
                OutstandingSingleCount = 0,
                OutstandingParlayCount = 0,
            };

            var tickets = new List<TicketEmailModel>
            {
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName1", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName2", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName3", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName4", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName5", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName6", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName7", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName8", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName9", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName10", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName11", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName12", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName13", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName14", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName15", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName16", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName17", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName18", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName19", Status = TicketStatus.Draw, BetTypeId = 29 },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false, UserName = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxUserName20", Status = TicketStatus.Draw, BetTypeId = 29 },
    };

            uusTicketService.IsValidSettledSingleTicket(Arg.Any<TicketEmailModel>()).Returns(true);
            uusTicketService.IsValidSettledParlayTicket(Arg.Any<TicketEmailModel>(), Arg.Any<bool>()).Returns(false);
            uusTicketService.IsValidCashOut(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(false);

            // Act
            var result = service.Create(model, tickets);

            // Assert
            Assert.Equal(2, result.Count());
        }
    }
}
