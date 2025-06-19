using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByBetId.Handlers;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Handlers;

[Category("VoidByBetId")]
public class GetTicketsHandlerTest
{
    private static GetTicketsHandler CreateService(
        GetTicketsService getTicketsService,
        PagingService pagingService)
    {
        return new GetTicketsHandler(
            getTicketsService,
            pagingService);
    }

    [Fact]
    public async Task GetTickets_ValidData_AssignTicket()
    {
        // Arrange
        var request = new GetTicketsRequest { TransIds = "134646,97465" };
        var tickets = new List<GetTicketModel>
        {
            new() { GroupName = "AAA", LicenseeName = "", IsCashOut = false },
            new() { GroupName = "AAA", BetType = 29 }
        };
        var groupTickets = new List<Group<GetTicketModel>>
        {
            new()
            {
                Name = "AAA",
                Tickets = new List<GetTicketModel> { new() { GroupName = "AAA" } }
            }
        };
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs((tickets, "", "", 1));
        var pagingService = Substitute.For<PagingService>();
        pagingService.Groups(tickets, ticket => ticket.GroupName).ReturnsForAnyArgs(groupTickets);
        var service = CreateService(getTicketsService, pagingService);

        // Act
        await service.Handle(request, CancellationToken.None);

        // Assert
        await getTicketsService.Received().AssignData(groupTickets[0]);
    }
}