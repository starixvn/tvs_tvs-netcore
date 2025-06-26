using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Repositories;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.GetTickets;

[Category("VoidByBetId")]
public class GetTicketsServiceTest
{
    [Fact]
    public async Task AssignData_HasTicketsInGroup_CallGetTicketFromTicketHtml()
    {
        // Arrange
        const int transId = 123;
        var tickets = new Group<GetTicketModel>
        {
            Tickets = new List<GetTicketModel> { new() { TransId = transId } }
        };
        var repository = Substitute.For<VoidByBetIdRepository>();
        var sessionService = Substitute.For<SessionService>();
        var ticketHtmlService = Substitute.For<TicketService>();
        ticketHtmlService
            .GetTicket(Arg.Any<GetTicketModel>(), Arg.Any<UserPermission>())
            .Returns(new TicketViewModel());
        var service = new GetTicketsServiceImp(repository, sessionService, ticketHtmlService);

        // Act
        await service.AssignData(tickets);

        // Assert
        ticketHtmlService
            .Received()
            .GetTicket(Arg.Is<GetTicketModel>(x => x.TransId == transId), Arg.Any<UserPermission>());
    }

    [Fact]
    public async Task Assign_NoTicketsInGroup_DidNotCallGetTicketFromTicketHtml()
    {
        // Arrange
        var tickets = new Group<GetTicketModel> { Tickets = new List<GetTicketModel>() };
        var repository = Substitute.For<VoidByBetIdRepository>();
        var sessionService = Substitute.For<SessionService>();
        var ticketHtmlService = Substitute.For<TicketService>();
        var service = new GetTicketsServiceImp(repository, sessionService, ticketHtmlService);

        // Act
        await service.AssignData(tickets);

        // Assert
        ticketHtmlService
            .DidNotReceive()
            .GetTicket(Arg.Any<GetTicketModel>(), Arg.Any<UserPermission>());
    }

    [Fact]
    public async Task GetTickets_ShouldCallRepositoryAndReturnCorrectData()
    {
        // Arrange
        var query = new GetTicketsQuery();
        var expectedTickets = new List<GetTicketModel>();
        const string expectedInvalidTransIds = "123,456";
        const string expectedMovedTransIds = "789";
        const int expectedMatchId = 1;

        var repository = Substitute.For<VoidByBetIdRepository>();
        var sessionService = Substitute.For<SessionService>();
        var ticketHtmlService = Substitute.For<TicketService>();

        repository
            .GetTickets(query)
            .Returns((expectedTickets, expectedInvalidTransIds, expectedMovedTransIds, expectedMatchId));

        var service = new GetTicketsServiceImp(repository, sessionService, ticketHtmlService);

        // Act
        var result = await service.GetTickets(query);

        // Assert
        await repository.Received(1).GetTickets(query);
        Assert.Equal(expectedTickets, result.Tickets);
        Assert.Equal(expectedInvalidTransIds, result.InvalidTransIds);
        Assert.Equal(expectedMovedTransIds, result.MovedTransIds);
        Assert.Equal(expectedMatchId, result.matchId);
    }
}