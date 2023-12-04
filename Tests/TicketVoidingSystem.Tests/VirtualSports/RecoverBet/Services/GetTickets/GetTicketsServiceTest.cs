using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.GetTickets;


public class GetTicketsServiceTest
{
    [Fact]
    public async Task ExecuteQuery_MapperQueryToCriteria_CallRepository()
    {
        // Arrange
        var query = new Query { MatchId = 123 };
        var repository = Substitute.For<Repository>();
        var displayTicketService = Substitute.For<TicketService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new GetTicketsServiceImp(repository, displayTicketService, sessionService);

        // Act
        await service.ExecuteQuery(query);

        // Assert
        await repository.Received().GetTickets(Arg.Is<Query>(x => x.MatchId == query.MatchId));
    }

    [Fact]
    public async Task Assign_HasTicketsInGroup_CallDisplayTicketService()
    {
        // Arrange
        const long transId = 123;
        var tickets = new Group<GetTicketModel>
        {
            Tickets = new List<GetTicketModel> { new() { TransId = transId } }
        };
        var repository = Substitute.For<Repository>();
        var displayTicketService = Substitute.For<TicketService>();
        var sessionService = Substitute.For<SessionService>();
        displayTicketService
            .GetTicket(Arg.Any<GetTicketModel>(), Arg.Any<Recover>())
            .ReturnsForAnyArgs(new TicketViewModel());
        var service = new GetTicketsServiceImp(repository, displayTicketService, sessionService);

        // Act
        await service.AssignData(tickets, Recover.None);

        // Assert
        displayTicketService
            .Received()
            .GetTicket(Arg.Is<GetTicketModel>(x => x.TransId == transId), Recover.None);
    }

    [Fact]
    public async Task Assign_HasNotTicketsInGroup_DidNotCallDisplayTicketService()
    {
        // Arrange
        var tickets = new Group<GetTicketModel>
        {
            Tickets = new List<GetTicketModel>()
        };
        var repository = Substitute.For<Repository>();
        var displayTicketService = Substitute.For<TicketService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new GetTicketsServiceImp(repository, displayTicketService, sessionService);

        // Act
        await service.AssignData(tickets, Recover.None);

        // Assert
        displayTicketService
            .DidNotReceive()
            .GetTicket(Arg.Any<GetTicketModel>(), Recover.None);
    }
}