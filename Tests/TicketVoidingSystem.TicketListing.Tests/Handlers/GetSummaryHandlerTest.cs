using NSubstitute;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Handlers;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.ViewModels;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Handlers;

public class GetSummaryHandlerTest
{
    [Fact]
    public async Task Handler_CallGetSummaryTickets()
    {
        // Arrange
        var request = new GetSummaryRequest { Product = 1 };
        var viewModel = new GetSummaryViewModel();
        var summaryTicketsService = Substitute.For<GetSummaryTicketsService>();
        summaryTicketsService.GetSummaryTickets(default!).ReturnsForAnyArgs(viewModel);
        var handler = new GetSummaryHandler(summaryTicketsService);

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await summaryTicketsService.Received().GetSummaryTickets(Arg.Is<GetSummaryQuery>(x => x.Product == 1));
    }
}