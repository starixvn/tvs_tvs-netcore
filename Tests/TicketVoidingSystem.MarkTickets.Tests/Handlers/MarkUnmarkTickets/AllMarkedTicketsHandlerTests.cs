using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Services;
using Xunit;

namespace SpecialDelete.UnitTests.MarkTickets.Handlers
{
    public class AllMarkedTicketsHandlerTests
    {
        [Fact]
        public async Task GetTickets_HaveTickets_TotalMarkedTicketsHavePagging()
        {
            // Arrange
            var request = new AllMarkedTicketsRequest();
            var data = new List<AllMarkedTicketModel> {
                new () { MatchId = 12345, UserId = 1, CreatedDate = DateTime.Today, HomeId = 1, AwayId = 6, Total = 10},
                new () { MatchId = 12323, UserId = 1, CreatedDate = DateTime.Today, HomeId = 2, AwayId = 4, Total = 11},
                new () { MatchId = 12543, UserId = 1, CreatedDate = DateTime.Today, HomeId = 3, AwayId = 5, Total = 12}
            };
            var getTicketsService = Substitute.For<GetTicketsService>();
            getTicketsService.GetAllMarkedTickets(default).ReturnsForAnyArgs(data);
            var pagingService = Substitute.For<PagingService>();
            var remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
            pagingService.Paging(data, request.PageIndex, request.PageSize).ReturnsForAnyArgs(data);
            var handler = new AllMarkedTicketsHandler(getTicketsService, pagingService, remotingRefWrapperService);

            // Act
            var result = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Equal(data.Count, result.TicketList.Count());
        }
    }
}