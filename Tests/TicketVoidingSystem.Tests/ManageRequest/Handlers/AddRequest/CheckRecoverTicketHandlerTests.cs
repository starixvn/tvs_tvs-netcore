using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.RecoverTicket;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;


namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class CheckRecoverTicketHandlerTests
{
    private readonly CheckRecoverTicketService checkRecoverTicketService;
    private readonly CheckRecoverTicketHandler handler;

    public CheckRecoverTicketHandlerTests()
    {
        checkRecoverTicketService = Substitute.For<CheckRecoverTicketService>();
        handler = new CheckRecoverTicketHandler(checkRecoverTicketService);
    }

    [Fact]
    public async Task Handler_Successful_CheckRecoverTicketServiceHasCalled()
    {
        // Arrange
        var request = new CheckRecoverTicketRequest { RequestId = 1 };
        var viewModel = new CheckRecoverTicketViewModel
        {
            InvalidTransIds = "123",
            UnsupportedDateRangeTransIds = "456",
            TransInfoJson = "12"
        };
        checkRecoverTicketService.CheckRecoverTicket(request).ReturnsForAnyArgs(viewModel);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        await checkRecoverTicketService.Received(1)
            .CheckRecoverTicket(Arg.Is<CheckRecoverTicketRequest>(x => x.RequestId == 1));
        AssertExtension.Equal(viewModel, actual);
    }
}