using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.MarkUnmarkTickets;

public class GetTicketsServiceTests
{
    private static GetTicketsServiceImp CreateService(IDynamicRepository repository)
    {
        var mapper = TestSetup.CreateMapper();
        var mapTicketService = Substitute.For<MapTicketService>();

        return new GetTicketsServiceImp(
            mapper,
            mapTicketService,
            repository);
    }

    [Fact]
    public async Task GetTickets_HasCriteria_CallGetTicketsByRepository()
    {
        // Arrange
        var query = new GetTicketsQuery { MatchId = 132 };
        var validation = new List<GetTicketValidationModel> { new() { ErrorCode = 0 } };
        var ticketList = new List<GetTicketModel> { new() { BetId = 123 } };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchMultipleAsync<GetTicketValidationModel, GetTicketModel>(default).ReturnsForAnyArgs((validation, ticketList));
        var service = CreateService(repository);

        // Act
        var actual = await service.GetTickets(query);

        // Assert
        Assert.NotNull(actual.Tickets);
    }

    [Fact]
    public async Task GetDetailTickets_HasCriteria_CallGetTicketsByRepository()
    {
        // Arrange
        var query = new GetDetailTicketsQuery { MatchId = 132 };
        var expected = new List<GetTicketModel> { new() { BetId = 123 } };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<GetTicketModel>(default).ReturnsForAnyArgs(expected);
        var service = CreateService(repository);

        // Act
        var tickets = await service.GetDetailTickets(query);

        // Assert
        Assert.NotNull(tickets);
    }

    [Fact]
    public async Task GetAllMarkedTickets_HasCriteria_CallGetTicketsByRepository()
    {
        // Arrange
        var expected = new List<AllMarkedTicketModel> { new() { MatchId = 123 } };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<AllMarkedTicketModel>(default).ReturnsForAnyArgs(expected);
        var service = CreateService(repository);

        // Act
        var tickets = await service.GetAllMarkedTickets(new AllMarkedTicketsQuery());

        // Assert
        Assert.NotNull(tickets);
    }
}