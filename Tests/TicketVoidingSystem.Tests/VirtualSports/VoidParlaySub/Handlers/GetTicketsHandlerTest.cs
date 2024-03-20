using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Handlers;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Handlers;

public class GetTicketsHandlerTest
{
    [Fact]
    public async Task GetTickets_ValidData_AssignTicket()
    {
        // Arrange
        var message = new GetTicketsRequest { MatchId = 123 };
        var model = new GetTicketsModel
        {
            Tickets = new List<GetTicketModel> { new() { GroupName = "AAA" } }
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
        getTicketsService.ExecuteQuery(message).ReturnsForAnyArgs(model);
        var pagingService = Substitute.For<PagingService>();
        pagingService.Groups(model.Tickets, ticket => ticket.GroupName).ReturnsForAnyArgs(groupTickets);
        var handler = new GetTicketsHandler(getTicketsService, pagingService);

        // Act
        _ = await handler.Handle(message, CancellationToken.None);

        // Assert
        await getTicketsService.Received().AssignData(groupTickets[0]);
    }
}