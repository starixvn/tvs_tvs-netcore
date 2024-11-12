using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Repositories;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Services.GetTickets;


public class GetTicketsServiceTest
{
    [Fact]
    public async Task ExecuteQuery_ValidCriteria_ReturnTicketsFromRepository()
    {
        // Arrange
        var expected = new GetTicketsModel
        {
            Tickets =
            [
                new() { TransId = 1 },
                new() { TransId = 2 }
            ]
        };
        var repository = Substitute.For<Repository>();
        var displayTicketService = Substitute.For<TicketService>();
        repository.GetTickets(Arg.Any<GetTicketsQuery>()).ReturnsForAnyArgs(expected);
        var sessionService = Substitute.For<SessionService>();
        var service = new GetTicketsServiceImp(repository, displayTicketService, sessionService);

        // Act
        var model = await service.ExecuteQuery(new GetTicketsQuery());

        // Assert
        AssertExtension.Equal(expected, model);
    }

    [Fact]
    public async Task AssignData_GroupContainTickets_CallDisplayTicketService()
    {
        // Arrange
        var group = new Group<GetTicketModel>
        {
            Name = "TEST",
            Tickets = new List<GetTicketModel>
            {
                new() { TransId = 123 }
            }
        };
        var repository = Substitute.For<Repository>();
        var displayTicketService = Substitute.For<TicketService>();
        var sessionService = Substitute.For<SessionService>();
        displayTicketService.GetTicket(Arg.Any<GetTicketModel>())
            .ReturnsForAnyArgs(new TicketViewModel());
        var service = new GetTicketsServiceImp(repository, displayTicketService, sessionService);

        // Act
        await service.AssignData(group);

        // Assert
        displayTicketService.Received().GetTicket(Arg.Is<GetTicketModel>(x => x.TransId == group.Tickets.First().TransId));
    }
}