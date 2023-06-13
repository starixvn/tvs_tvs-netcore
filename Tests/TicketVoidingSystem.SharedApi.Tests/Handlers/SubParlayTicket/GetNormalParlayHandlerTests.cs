using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using System.Collections.Generic;
using TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;
using System.Linq;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.SubParlayTicket;

public class GetNormalParlayHandlerTests
{
    private readonly TicketsService ticketsService;
    private readonly GetNormalParlayHandler handler;

    public GetNormalParlayHandlerTests()
    {
        ticketsService = Substitute.For<TicketsService>();
        handler = new GetNormalParlayHandler(ticketsService);
    }

    [Fact]
    public async Task Handle_Returns_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetNormalParlayRequest();
        var expected = new List<TicketViewModel> { };
        var tickets = new List<TicketModel> { };
        ticketsService.GetTickets(request.RefNo, CancellationToken.None).ReturnsForAnyArgs(tickets);
        ticketsService.GetTickets(tickets).ReturnsForAnyArgs(expected);
        
        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected.ToList().Count(), actual.ToList().Count());
    }
}