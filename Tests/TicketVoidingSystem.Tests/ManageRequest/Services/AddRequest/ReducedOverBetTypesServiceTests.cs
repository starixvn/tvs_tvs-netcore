using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest;

public class ReducedOverBetTypesServiceTests
{
    private readonly BetTypesRepository repository;
    private readonly ReducedOverBetTypesServiceImp service;

    public ReducedOverBetTypesServiceTests()
    {
        repository = Substitute.For<BetTypesRepository>();
        service = new ReducedOverBetTypesServiceImp(repository);
    }

    [Fact]
    public async Task GetReducedOverBetTypesHavesTickets_ValidRequest_RepositoryHasCalled()
    {
        // Arrange
        var models = new List<ReducedOverBetTypesModel>
        {
            new () { BetTypeId = 1 },
            new () { BetTypeId = 2 },
            new () { BetTypeId = 3 },
        };
        var data = new List<BetTypeModel>
        {
            new() { Id = "1" },
            new() { Id = "2" },
            new() { Id = "4" },
        };
        var expected = new List<ReducedOverBetTypesModel>
        {
            new () { BetTypeId = 1 },
            new () { BetTypeId = 2 }
        };
        repository.GetBetTypesHaveTicketsForTvs(Arg.Any<int>())
            .ReturnsForAnyArgs(data);
        // Act
        var actual = await service.GetReducedOverBetTypesHavesTickets(models, 1);

        // Assert
        await repository.Received(1).GetBetTypesHaveTicketsForTvs(Arg.Any<int>());
        AssertExtension.Equal(expected, actual);
    }
}