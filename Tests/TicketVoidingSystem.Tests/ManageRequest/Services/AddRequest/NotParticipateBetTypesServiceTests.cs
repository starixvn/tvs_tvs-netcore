using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest;

public class NotParticipateBetTypesServiceTests
{
    private readonly BetTypesRepository betTypesRepository;
    private readonly IDynamicRepository dynamicRepository;
    private readonly NotParticipateBetTypesServiceImp service;

    public NotParticipateBetTypesServiceTests()
    {
        betTypesRepository = Substitute.For<BetTypesRepository>();
        dynamicRepository = Substitute.For<IDynamicRepository>();
        service = new NotParticipateBetTypesServiceImp(betTypesRepository, dynamicRepository);
    }

    [Fact]
    public async Task GetNotParticipateBetTypesHavesTickets_ValidRequest_RepositoryHasCalled()
    {
        // Arrange
        var models = new List<NotParticipateBetTypesModel>
        {
            new () { BetTypeId = 1, ParentId = 1 },
            new () { BetTypeId = 2, ParentId = 2 },
            new () { BetTypeId = 3, ParentId = 3 },
            new () { BetTypeId = 4, ParentId = 4 }
        };
        var data = new List<BetTypeModel>
        {
            new() { Id = "1" },
            new() { Id = "2" },
            new() { Id = "3" },
            new() { Id = "4" },
        };
        var expected = new List<NotParticipateBetTypesModel>
        {
            new () { BetTypeId = 1, ParentId = 1, ParentName = "1 Inns" },
            new () { BetTypeId = 2, ParentId = 2, ParentName = "2 Inns" },
            new () { BetTypeId = 3, ParentId = 3, ParentName = "FT" },
            new () { BetTypeId = 4, ParentId = 4, ParentName = "" }
        };
        betTypesRepository.GetBetTypesHaveTicketsForTvs(Arg.Any<int>(), null, null).ReturnsForAnyArgs(data);

        // Act
        var actual = await service.GetNotParticipateBetTypesHavesTickets(models, 1);

        // Assert
        await betTypesRepository.Received(1).GetBetTypesHaveTicketsForTvs(Arg.Any<int>(), null, null);
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task GetPlayerHaveTickets_ValidRequest_RepositoryHasCalled()
    {
        // Arrange
        var models = new List<NotParticipateBetTypesModel>
        {
            new () { BetTypeId = 1 },
            new () { BetTypeId = 2 },
            new () { BetTypeId = 3 },
        };
        var data = new List<OddsInfoViewModel>
        {
            new() { BetTypeId = 1 },
            new() { BetTypeId = 2 }
        };
        dynamicRepository.FetchAsync<OddsInfoViewModel>(null).ReturnsForAnyArgs(data);

        // Act
        var actual = await service.GetPlayerHaveTickets(models, 1);

        // Assert
        await dynamicRepository.Received(1).FetchAsync<OddsInfoViewModel>(Arg.Is<GetOddsInfoCriteria>(x => x.MatchId == 1));
        AssertExtension.Equal(data, actual);
    }
}