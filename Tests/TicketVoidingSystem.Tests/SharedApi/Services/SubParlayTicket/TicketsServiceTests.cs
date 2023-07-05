using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Criteria.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.SubParlayTicket;

public class TicketsServiceTests : AppSettingFixture, IClassFixture<RemotingRefFixture>
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
        var expected = new List<TicketModel> { new(), new(), new() };
        var ticketModels = new List<TicketModel> { new() };
        repository.FetchAsync<TicketModel>(Arg.Any<GetParlaySubBetCriteria>(), CancellationToken.None)
            .ReturnsForAnyArgs(ticketModels);

        // Act
        var result = await service.GetTickets("123", CancellationToken.None);

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
        betListService.GetComboName(query.BetTeam, query.BetCheck, query.Handicap1, query.Handicap2)
            .ReturnsForAnyArgs(expected);

        // Act
        var result = service.GetComboName(query);

        // Assert
        Assert.NotNull(result);
        AssertExtension.Equal(expected, result);
        return Task.CompletedTask;
    }
}