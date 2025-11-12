using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.JackTimeHybridParlay;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Criteria.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.SubParlayTicket;

public class TicketsServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    private readonly BetListService betListService;
    private readonly IDynamicRepository repository;
    private readonly TicketsServiceImp service;

    public TicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        betListService = Substitute.For<BetListService>();

        service = new TicketsServiceImp(repository, betListService);
    }

    [Fact]
    public async Task GetTickets_Return_ExpectedValue()
    {
        // Arrange
        var expected = new List<TicketModel> { new(), new(), new(), new() };
        var ticketModels = new List<TicketModel> { new() };
        repository.FetchAsync<TicketModel>(Arg.Any<GetParlaySubBetCriteria>()).ReturnsForAnyArgs(ticketModels);

        // Act
        var result = await service.GetTickets("123");

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result);
    }

    [Theory]
    [InlineData(TicketStatus.VoidId, "<div class='strikethrough'>choice</div>")]
    [InlineData(TicketStatus.WonId, "choice")]
    public Task GetTickets_WithStatusIdNotIsVoidId_ReturnExpectedValue(byte statusId, string choice)
    {
        // Arrange
        var expected = new List<TicketViewModel> { new() { SubTransId = "1", Choice = choice } };
        var ticketModels = new List<TicketModel> { new() { TransId = 1, StatusId = statusId } };
        betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("choice");

        // Act
        var result = service.GetTickets(ticketModels);

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result);
        return Task.CompletedTask;
    }

    [Fact]
    public Task GetComboName_Return_ExpectedValue()
    {
        // Arrange
        var expected = new[] { "Combo1", "Combo2" };
        var query = new QueryComboParlay
        {
            BetTeam = "Team",
            BetCheck = "Check",
            Handicap1 = 1,
            Handicap2 = 2
        };
        betListService.GetComboName(query.BetTeam, query.BetCheck, query.Handicap1, query.Handicap2).ReturnsForAnyArgs(expected);

        // Act
        var result = service.GetComboName(query);

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result);
        return Task.CompletedTask;
    }

    [Fact]
    public Task GetHybridTickets_WithValidTickets_ReturnsExpectedViewModel()
    {
        // Arrange
        var tickets = new List<TicketModel>
        {
            new()
            {
                TransId = 1,
                BetType = 1,
                HomeId = 10,
                AwayId = 20,
                Hdp1 = 1.5m,
                Hdp2 = 2.5m,
                Odds = 1.8m,
                BetTeam = "Home",
                StatusId = TicketStatus.WonId,
                Status = "Won",
                EventDate = DateTime.Now,
                LiveHomeScore = 0,
                LiveAwayScore = 0,
                LiveIndicator = false,
                LeagueId = 100,
                SportType = 1,
                IsNeutral = false,
                MatchId = 500,
                Stake = 100m,
                BetCheck = "CHECK",
                TransDesc = "Test Description",
                ShowTime = "12:00",
                TransDate = DateTime.Now
            }
        };

        var model = new HybridParlayChoiceModel
        {
            SubTransId = "SUB123",
            Transdesc = "Hybrid Parlay Description",
            Hdp1 = 1,
            Hdp2 = 2,
            BetCheck = "CHECK",
            BetTeam = "TEAM",
            Currency = "USD",
            Stake = 200m
        };

        var expectedChoice = "<div>Hybrid Parlay Choice</div>";
        betListService.BuildChoiceHybridParlay(
            Arg.Any<ITicketHelper>(),
            Arg.Any<IList<ITicket>>(),
            Arg.Any<HybridParlayChoiceModel>(),
            false)
            .ReturnsForAnyArgs(expectedChoice);

        // Act
        var result = service.GetHybridTickets(tickets, model);

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal(model.SubTransId, result.First().SubTransId);
        Assert.Equal(expectedChoice, result.First().Choice);
        return Task.CompletedTask;
    }

    [Fact]
    public Task GetHybridTickets_WithEmptyTicketsList_ReturnsSingleViewModelWithEmptyChoice()
    {
        // Arrange
        var tickets = new List<TicketModel>();
        var model = new HybridParlayChoiceModel
        {
            SubTransId = "SUB123",
            Transdesc = "Test",
            Hdp1 = 1,
            Hdp2 = 2,
            BetCheck = "CHECK",
            BetTeam = "TEAM",
            Currency = "USD",
            Stake = 100m
        };

        betListService.BuildChoiceHybridParlay(
            Arg.Any<ITicketHelper>(),
            Arg.Any<IList<ITicket>>(),
            Arg.Any<HybridParlayChoiceModel>(),
            false)
            .ReturnsForAnyArgs("");

        // Act
        var result = service.GetHybridTickets(tickets, model);

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal(model.SubTransId, result.First().SubTransId);
        Assert.Equal("", result.First().Choice);
        return Task.CompletedTask;
    }

    [Fact]
    public Task GetHybridTickets_WithMultipleTickets_ReturnsSingleViewModel()
    {
        // Arrange
        var tickets = new List<TicketModel>
        {
            new()
            {
                TransId = 1,
                BetType = 1,
                HomeId = 10,
                AwayId = 20,
                Hdp1 = 1.5m,
                Hdp2 = 2.5m,
                Odds = 1.8m,
                BetTeam = "Home",
                StatusId = TicketStatus.WonId,
                Status = "Won",
                EventDate = DateTime.Now,
                LiveHomeScore = 0,
                LiveAwayScore = 0,
                LiveIndicator = false,
                LeagueId = 100,
                SportType = 1,
                IsNeutral = false,
                MatchId = 500,
                Stake = 100m,
                BetCheck = "CHECK",
                TransDesc = "Ticket 1",
                ShowTime = "12:00",
                TransDate = DateTime.Now
            },
            new()
            {
                TransId = 2,
                BetType = 2,
                HomeId = 30,
                AwayId = 40,
                Hdp1 = 2.5m,
                Hdp2 = 3.5m,
                Odds = 2.0m,
                BetTeam = "Away",
                StatusId = TicketStatus.WonId,
                Status = "Won",
                EventDate = DateTime.Now,
                LiveHomeScore = 0,
                LiveAwayScore = 0,
                LiveIndicator = false,
                LeagueId = 200,
                SportType = 1,
                IsNeutral = false,
                MatchId = 600,
                Stake = 150m,
                BetCheck = "CHECK2",
                TransDesc = "Ticket 2",
                ShowTime = "13:00",
                TransDate = DateTime.Now
            }
        };

        var model = new HybridParlayChoiceModel
        {
            SubTransId = "SUB456",
            Transdesc = "Multiple Tickets Hybrid",
            Hdp1 = 1,
            Hdp2 = 2,
            BetCheck = "CHECK",
            BetTeam = "TEAM",
            Currency = "EUR",
            Stake = 300m
        };

        var expectedChoice = "<div>Multiple Tickets Choice</div>";
        betListService.BuildChoiceHybridParlay(
            Arg.Any<ITicketHelper>(),
            Arg.Any<IList<ITicket>>(),
            Arg.Any<HybridParlayChoiceModel>(),
            false)
            .ReturnsForAnyArgs(expectedChoice);

        // Act
        var result = service.GetHybridTickets(tickets, model);

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal(model.SubTransId, result.First().SubTransId);
        Assert.Equal(expectedChoice, result.First().Choice);
        return Task.CompletedTask;
    }

    [Fact]
    public Task GetHybridTickets_CallsBuildChoiceHybridParlayWithCorrectParameters()
    {
        // Arrange
        var tickets = new List<TicketModel>
        {
            new()
            {
                TransId = 1,
                BetType = 1,
                HomeId = 10,
                AwayId = 20,
                Hdp1 = 1.5m,
                Hdp2 = 2.5m,
                Odds = 1.8m,
                BetTeam = "Home",
                StatusId = TicketStatus.WonId,
                Status = "Won",
                EventDate = DateTime.Now,
                LiveHomeScore = 0,
                LiveAwayScore = 0,
                LiveIndicator = false,
                LeagueId = 100,
                SportType = 1,
                IsNeutral = false,
                MatchId = 500,
                Stake = 100m,
                BetCheck = "CHECK",
                TransDesc = "Test",
                ShowTime = "12:00",
                TransDate = DateTime.Now
            }
        };

        var model = new HybridParlayChoiceModel
        {
            SubTransId = "SUB789",
            Transdesc = "Test Description",
            Hdp1 = 1,
            Hdp2 = 2,
            BetCheck = "CHECK",
            BetTeam = "TEAM",
            Currency = "USD",
            Stake = 100m
        };

        betListService.BuildChoiceHybridParlay(
            Arg.Any<ITicketHelper>(),
            Arg.Any<IList<ITicket>>(),
            Arg.Any<HybridParlayChoiceModel>(),
            false)
            .ReturnsForAnyArgs("Test Choice");

        // Act
        _ = service.GetHybridTickets(tickets, model);

        // Assert
        betListService.Received(1).BuildChoiceHybridParlay(
            Arg.Is<ITicketHelper>(helper => helper.IsShowOddsWithChoice == true),
            Arg.Is<IList<ITicket>>(list => list.Count == 1),
            Arg.Is<HybridParlayChoiceModel>(m => m.SubTransId == model.SubTransId),
            false);
        return Task.CompletedTask;
    }
}