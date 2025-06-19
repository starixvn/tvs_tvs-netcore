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
}