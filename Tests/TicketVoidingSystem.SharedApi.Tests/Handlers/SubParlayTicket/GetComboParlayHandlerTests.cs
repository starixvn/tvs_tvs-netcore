using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using System.Collections.Generic;
using TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;
using System.Linq;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.SubParlayTicket;

public class GetComboParlayHandlerTests
{
    private readonly TicketsService ticketsService;
    private readonly GetComboParlayHandler handler;

    public GetComboParlayHandlerTests()
    {
        ticketsService = Substitute.For<TicketsService>();
        handler = new GetComboParlayHandler(ticketsService);
    }

    [Fact]
    public async Task Handle_Returns_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetComboParlayRequest();
        var expected = new List<TicketViewModel> { new TicketViewModel{ Choice="", SubTransId = ""} };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected.ToList().Count(), actual.ToList().Count());
    }
}