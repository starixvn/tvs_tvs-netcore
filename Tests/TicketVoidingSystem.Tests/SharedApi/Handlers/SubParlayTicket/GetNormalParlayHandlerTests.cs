using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SubParlayTicket;

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