using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Repositories;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services.GetTickets;


public class GetTicketsServiceTest
{
    private static GetTicketsServiceImp CreateService(VoidByCurrencyRepository repository)
    {
        var sessionService = Substitute.For<SessionService>();
        var ticketHtmlService = Substitute.For<TicketService>();
        return new GetTicketsServiceImp(
            repository,
            sessionService,
            ticketHtmlService);
    }

    [Fact]
    public async Task GetTickets_HasQuery_CallGetTicketsByRepository()
    {
        // Arrange
        var query = new GetTicketsQuery
        {
            CurrencyIds = "2,3,4",
            LicenseeNames = "AAA,BBB",
            MatchId = 123,
            TicketType = "SingleTicket"
        };
        var repository = Substitute.For<VoidByCurrencyRepository>();
        var service = CreateService(repository);

        // Act
        await service.GetTickets(query);

        // Assert
        await repository.Received().GetTickets(Arg.Is<GetTicketsQuery>(x =>
            x.MatchId == query.MatchId &&
            x.LicenseeNames == query.LicenseeNames &&
            x.CurrencyIds == query.CurrencyIds &&
            x.TicketType == query.TicketType));
    }

    [Fact]
    public async Task Assign_HasTicketsInGroup_CallGetTicketDetailFromTicketHtml()
    {
        // Arrange
        const int transId = 123;
        var tickets = new Group<GetTicketModel>
        {
            Tickets = new List<GetTicketModel> { new GetTicketModel { TransId = transId } }
        };
        var repository = Substitute.For<VoidByCurrencyRepository>();
        var sessionService = Substitute.For<SessionService>();
        var ticketHtmlService = Substitute.For<TicketService>();
        ticketHtmlService
            .GetTicketDetail(Arg.Any<GetTicketModel>(), Arg.Any<UserPermission>(), false)
            .ReturnsForAnyArgs(new TicketViewModel());
        var service = new GetTicketsServiceImp(repository, sessionService, ticketHtmlService);

        // Act
        await service.AssignData(tickets, false);

        // Assert
        ticketHtmlService
            .Received()
            .GetTicketDetail(Arg.Is<GetTicketModel>(x => x.TransId == transId), Arg.Any<UserPermission>(), false);
    }

    [Fact]
    public async Task Assign_HasNotTicketsInGroup_DidNotCallGetTicketDetailFromTicketHtml()
    {
        // Arrange
        var tickets = new Group<GetTicketModel>
        {
            Tickets = new List<GetTicketModel>()
        };
        var repository = Substitute.For<VoidByCurrencyRepository>();
        var sessionService = Substitute.For<SessionService>();
        var ticketHtmlService = Substitute.For<TicketService>();
        var service = new GetTicketsServiceImp(repository, sessionService, ticketHtmlService);

        // Act
        await service.AssignData(tickets, true);

        // Assert
        ticketHtmlService
            .DidNotReceive()
            .GetTicketDetail(Arg.Any<GetTicketModel>(), Arg.Any<UserPermission>(), true);
    }
}