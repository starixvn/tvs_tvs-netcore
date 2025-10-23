using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class CheckTickets14HandlerTests
{
    private readonly CheckTickets14Handler handler;
    private readonly OnlineServerRepository repository = Substitute.For<OnlineServerRepository>();

    public CheckTickets14HandlerTests()
    {
        handler = new CheckTickets14Handler(repository);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckTickets14Request();
        var viewModel = new CheckTickets14ViewModel
        {
            InvalidTransIds = "123",
            UnsupportedDateRangeTransIds = "456",
            TransInfoJson = "12",
            BalanceUpTransIds = "12"
        };
        repository.FetchAsync<CheckTickets14ViewModel>(Arg.Any<CheckTickets14Criteria>()).ReturnsForAnyArgs([viewModel]);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }
}