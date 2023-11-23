using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Client.Helpers.Business;
using NSubstitute;
using SpecialDelete.NumberGame.Handlers;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using SpecialDelete.NumberGame.Services.GetTickets;
using SpecialDelete.NumberGame.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Handlers;


public class GetVoidTicketsHandlerTest
{
    [Fact]
    public async Task GetTickets_NoTicketsPaging_DidNotCallTicketService()
    {
        // Arrange
        var message = new GetVoidTicketsRequest { MatchId = 123 };
        var ticketService = Substitute.For<TicketService>();
        var pagingService = Substitute.For<PagingService>();
        pagingService.Groups(Arg.Any<List<GetTicketModel>>(), t => t.GroupName)
            .ReturnsForAnyArgs(new List<Group<GetTicketModel>>());

        var handler = CreateHandler(ticketService, pagingService);

        // Act
        await handler.Handle(message, CancellationToken.None);

        // Assert
        ticketService.DidNotReceive().GetTicket(Arg.Any<GetTicketModel>(), Arg.Any<bool>(),
            Arg.Any<bool>());
    }

    [Fact]
    public async Task GetTickets_ValidTickets_CallTicketService()
    {
        // Arrange
        var message = new GetVoidTicketsRequest { MatchId = 123 };
        var ticketService = Substitute.For<TicketService>();
        ticketService.GetTicket(Arg.Any<GetTicketModel>(), Arg.Any<bool>(), Arg.Any<bool>())
            .ReturnsForAnyArgs(new TicketViewModel());
        var pagingService = Substitute.For<PagingService>();
        pagingService.Groups(Arg.Any<List<GetTicketModel>>(), t => t.GroupName)
            .ReturnsForAnyArgs(
                new List<Group<GetTicketModel>>
                {
                    new()
                    {
                        Name = "AAA",
                        Tickets = new List<GetTicketModel>
                            { new() { TransId = 123, Site = "", GroupName = "" } }
                    }
                });

        var handler = CreateHandler(ticketService, pagingService);

        // Act
        await handler.Handle(message, CancellationToken.None);

        // Assert
        ticketService.Received()
            .GetTicket(Arg.Is<GetTicketModel>(x => x.TransId == 123), false, false);
    }

    private static GetVoidTicketsHandler CreateHandler(
        TicketService ticketService,
        PagingService pagingService)
    {
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidNumberGameBet, Constant.Policy.Host)
            .ReturnsForAnyArgs(true);
        var repository = Substitute.For<Repository>();
        repository.GetVoidTickets(new GetVoidTicketsQuery())
            .ReturnsForAnyArgs(new GetTicketsModel
            { Tickets = new List<GetTicketModel> { new() { TransId = 123 } } });

        return new GetVoidTicketsHandler(
            sessionService,
            repository,
            pagingService,
            ticketService);
    }
}