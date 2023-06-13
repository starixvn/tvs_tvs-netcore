using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using System.Collections.Generic;
using Extensions;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.Services.BetList;
using Fanex.Data.Repository;
using System.Threading;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Criteria.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.SharedApi.Tests.Services.SubParlayTicket;

public class TicketsServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly BetListService betListService;
    private readonly TicketsServiceImp service;

    public TicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        betListService = Substitute.For<BetListService>();

        service = new TicketsServiceImp(repository, betListService);
    }

    // [Fact]
    // public async Task GetTickets_Return_ExpectedValue()
    // {
    //     // Arrange
    //     var criteria = new GetParlaySubBetCriteria();
    //     var expected = new List<TicketModel> { new TicketModel(), new TicketModel(), new TicketModel() };
    //     var ticketModels = new List<TicketModel> { new TicketModel() };
    //     repository.FetchAsync<TicketModel>(criteria, CancellationToken.None).ReturnsForAnyArgs(ticketModels);

    //     // Act
    //     var result = service.GetTickets("123", CancellationToken.None);

    //     // Assert
    //     Assert.NotNull(result);
    //     AssertExtension.Equal(expected, result);
    // }

    // [Fact]
    // public async Task GetTickets_WithStatusIdNotIsVoidId_ReturnExpectedValue()
    // {
    //     // Arrange
    //     var expected = new List<TicketViewModel> { new TicketViewModel { SubTransId = "1", Choice = "1" } };
    //     var ticketModels = new List<TicketModel> { new TicketModel { TransId = 1 } };
    //     betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("1");

    //     // Act
    //     var result = service.GetTickets(ticketModels);

    //     // Assert
    //     Assert.NotNull(result);
    //     AssertExtension.Equal(expected, result);
    // }

    // [Fact]
    // public async Task GetTickets_WithStatusIdsVoidId_ReturnExpectedValue()
    // {
    //     // Arrange
    //     var expected = new List<TicketViewModel> { new TicketViewModel { SubTransId = "1", Choice = $"<div class='strikethrough'>1</div>" } };
    //     var ticketModels = new List<TicketModel> { new TicketModel { TransId = 1, StatusId = TicketStatus.VoidId } };
    //     betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("1");

    //     // Act
    //     var result = service.GetTickets(ticketModels);

    //     // Assert
    //     Assert.NotNull(result);
    //     AssertExtension.Equal(expected, result);
    // }

    [Fact]
    public async Task GetComboName_Return_ExpectedValue()
    {
        // Arrange
        var expected = new string[] { "Combo1", "Combo2" };
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
    }
}