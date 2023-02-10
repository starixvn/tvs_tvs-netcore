using NSubstitute;
using TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Handlers.MarkUnmarkTickets;

public class GetTicketsHandlerTests
{
    [Fact]
    public async Task GetTickets_GetTicketsHasCalled()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var listGroup = new List<Group<GetTicketModel>>
        {
            new()
            {
                Tickets = new List<GetTicketModel> { new() }
            }
        };
        var data = new List<GetTicketModel>();
        var validation = new GetTicketValidationModel
        {
            ErrorCode = 1,
            ErrorMsg = "Something Wrong"
        };
        var getTicketsService = Substitute.For<GetTicketsService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs((validation, data));
        var pagingService = Substitute.For<PagingService>();
        pagingService.Paging(data, request.PageIndex, request.PageSize).ReturnsForAnyArgs(new List<GetTicketModel> { new() });
        pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(getTicketsService, mapTicketService, pagingService);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        await getTicketsService.Received().GetTickets(Arg.Compat.Any<GetTicketsQuery>());
        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetTickets_HaveTicketsDisplay_UpdateFromToTime()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var listGroup = new List<Group<GetTicketModel>>
        {
            new()
            {
                Tickets = new List<GetTicketModel> { new() }
            }
        };
        var data = new List<GetTicketModel> {
            new() { TransDate = new DateTime(2019, 4, 24, 4, 10, 10, 111), GroupName = string.Empty, IsMixParlay = true },
            new() { TransDate = new DateTime(2019, 3, 24, 6, 10, 10, 111), GroupName = string.Empty, IsMixParlay = true },
            new() { TransDate = new DateTime(2019, 2, 24, 2, 10, 10, 111), GroupName = string.Empty, IsMixParlay = true },
            new() { TransDate = new DateTime(2019, 2, 24, 2, 10, 10, 111), GroupName = string.Empty, IsMixParlay = false },
        };
        const string expectedFromTime = "02:10:10 PM";
        const string expectedToTime = "04:10:10 PM";
        var validation = new GetTicketValidationModel
        {
            ErrorCode = 1,
            ErrorMsg = "Something Wrong"
        };
        var getTicketsService = Substitute.For<GetTicketsService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs((validation, data));
        var pagingService = Substitute.For<PagingService>();
        pagingService.Paging(data, request.PageIndex, request.PageSize).ReturnsForAnyArgs(new List<GetTicketModel> { new() });
        pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(getTicketsService, mapTicketService, pagingService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expectedFromTime, model.FromTime);
        Assert.Equal(expectedToTime, model.ToTime);
    }

    [Fact]
    public async Task GetTickets_HaveTicketsDisplay_HaveLicensees()
    {
        // Arrange
        var request = new GetTicketsRequest();
        var listGroup = new List<Group<GetTicketModel>>
        {
            new()
            {
                Tickets = new List<GetTicketModel> { new() }
            }
        };
        var data = new List<GetTicketModel> {
            new() { LicenseeName = "LicenseeA", IsDeposit = true },
            new() { LicenseeName = "LicenseeB", IsDeposit = true },
            new() { LicenseeName = "LicenseeC", IsDeposit = false },
            new() { LicenseeName = "LicenseeC", IsDeposit = false , IsMixParlay = true}
        };
        const string expectedLicensees = "LicenseeA, LicenseeB";
        var validation = new GetTicketValidationModel
        {
            ErrorCode = 1,
            ErrorMsg = "Something Wrong"
        };
        var getTicketsService = Substitute.For<GetTicketsService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        getTicketsService.GetTickets(default).ReturnsForAnyArgs((validation, data));
        var pagingService = Substitute.For<PagingService>();
        pagingService.Paging(data, request.PageIndex, request.PageSize).ReturnsForAnyArgs(new List<GetTicketModel>());
        pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);
        var handler = new GetTicketsHandler(getTicketsService, mapTicketService, pagingService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expectedLicensees, model.LicenseesName);
    }
}