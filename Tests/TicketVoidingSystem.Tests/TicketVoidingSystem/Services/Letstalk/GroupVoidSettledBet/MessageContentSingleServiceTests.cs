using Xunit;
using NSubstitute;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using System.Collections.Generic;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using System;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet
{
    public class MessageContentSingleServiceTests
    {
        private readonly UusTicketService uusTicketService;
        private readonly MessageContentSingleServiceImp service;

        public MessageContentSingleServiceTests()
        {
            uusTicketService = Substitute.For<UusTicketService>();
            service = new MessageContentSingleServiceImp(uusTicketService);
        }

        [Fact]
        public void Create_NoValidTickets_ReturnEmptyString()
        {
            // Arrange
            var model = new TicketInfoForLetstalk();
            var tickets = new List<TicketEmailModel>();

            // Act
            var result = service.Create(model, tickets);

            // Assert
            Assert.Equal(string.Empty, result);
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
            var matchEvent = $"{model.Match.HomeName} - vs - {model.Match.AwayName}";
            var countInfo = new TicketCountInfo
            {
                SingleCount = 1,
                InstantOUCount = 1,
                CashOutCount = 0,
                ParlayCount = 0
            };

            var tickets = new List<TicketEmailModel>
    {
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = true },
        new TicketEmailModel { IsMixParlay = false, IsInstantSettlementTicket = false },
        new TicketEmailModel { IsMixParlay = true, IsInstantSettlementTicket = true },
        new TicketEmailModel { IsMixParlay = true, IsInstantSettlementTicket = false }
    };
            var expected = $"Match ID: {model.Match.MatchId}{Environment.NewLine}"
               + $"Event Date: {model.Match.EventDate:dd MMMM yyyy}{Environment.NewLine}"
               + $"Kick Off: {model.Match.KickOffTime:h:mm tt}{Environment.NewLine}"
               + $"League: {model.Match.LeagueName}{Environment.NewLine}"
               + $"Match: {matchEvent}{Environment.NewLine}"
               + $"Voided by: {model.UserName}{Environment.NewLine}"
               + $"Void Time: {model.VoidFromTime} - {model.VoidToTime}"
               + $"(Single Count: {countInfo.SingleCount}, Instant OU: {countInfo.InstantOUCount}, Cash Out: {countInfo.CashOutCount}, Parlay Count: {countInfo.ParlayCount})";

            uusTicketService.IsValidSettledSingleTicket(Arg.Any<TicketEmailModel>()).Returns(true);
            uusTicketService.IsValidSettledParlayTicket(Arg.Any<TicketEmailModel>(), Arg.Any<bool>()).Returns(false);
            uusTicketService.IsValidCashOut(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(false);

            // Act
            var result = service.Create(model, tickets);

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public void Create_TicketsHasOnlyOneSettledParlayTicket_CorrectMessage()
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
                    AwayId = 0
                },
                UserName = "John Doe",
                VoidFromTime = new DateTime(2022, 1, 1, 1, 1, 3).ToString("dd MMMM yyyy"),
                VoidToTime = new DateTime(2022, 1, 1, 1, 1, 4).ToString()
            };
            var matchEvent = "Team A";
            var countInfo = new TicketCountInfo
            {
                SingleCount = 0,
                InstantOUCount = 0,
                CashOutCount = 0,
                ParlayCount = 1
            };

            var tickets = new List<TicketEmailModel>
    {
        new TicketEmailModel { IsMixParlay = true, IsInstantSettlementTicket = true }
    };
            var expected = $"Match ID: {model.Match.MatchId}{Environment.NewLine}"
               + $"Event Date: {model.Match.EventDate:dd MMMM yyyy}{Environment.NewLine}"
               + $"Kick Off: {model.Match.KickOffTime:h:mm tt}{Environment.NewLine}"
               + $"League: {model.Match.LeagueName}{Environment.NewLine}"
               + $"Match: {matchEvent}{Environment.NewLine}"
               + $"Voided by: {model.UserName}{Environment.NewLine}"
               + $"Void Time: {model.VoidFromTime} - {model.VoidToTime}"
               + $"(Single Count: {countInfo.SingleCount}, Instant OU: {countInfo.InstantOUCount}, Cash Out: {countInfo.CashOutCount}, Parlay Count: {countInfo.ParlayCount})";

            uusTicketService.IsValidSettledParlayTicket(Arg.Any<TicketEmailModel>(), Arg.Any<bool>()).Returns(true);
            uusTicketService.IsValidCashOut(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(false);

            // Act
            var result = service.Create(model, tickets);

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public void Create_TicketsHasOnlyOneCashOutTicket_CorrectMessage()
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
                    AwayId = 0
                },
                UserName = "John Doe",
                VoidFromTime = new DateTime(2022, 1, 1, 1, 1, 3).ToString("dd MMMM yyyy"),
                VoidToTime = new DateTime(2022, 1, 1, 1, 1, 4).ToString()
            };
            var matchEvent = "Team A";
            var countInfo = new TicketCountInfo
            {
                SingleCount = 0,
                InstantOUCount = 0,
                CashOutCount = 1,
                ParlayCount = 0
            };

            var tickets = new List<TicketEmailModel>
    {
        new TicketEmailModel { IsMixParlay = true, IsInstantSettlementTicket = true }
    };
            var expected = $"Match ID: {model.Match.MatchId}{Environment.NewLine}"
               + $"Event Date: {model.Match.EventDate:dd MMMM yyyy}{Environment.NewLine}"
               + $"Kick Off: {model.Match.KickOffTime:h:mm tt}{Environment.NewLine}"
               + $"League: {model.Match.LeagueName}{Environment.NewLine}"
               + $"Match: {matchEvent}{Environment.NewLine}"
               + $"Voided by: {model.UserName}{Environment.NewLine}"
               + $"Void Time: {model.VoidFromTime} - {model.VoidToTime}"
               + $"(Single Count: {countInfo.SingleCount}, Instant OU: {countInfo.InstantOUCount}, Cash Out: {countInfo.CashOutCount}, Parlay Count: {countInfo.ParlayCount})";

            uusTicketService.IsValidSettledParlayTicket(Arg.Any<TicketEmailModel>(), Arg.Any<bool>()).Returns(false);
            uusTicketService.IsValidCashOut(Arg.Any<TicketEmailModel>()).ReturnsForAnyArgs(true);

            // Act
            var result = service.Create(model, tickets);

            // Assert
            Assert.Equal(expected, result);
        }
    }
}
