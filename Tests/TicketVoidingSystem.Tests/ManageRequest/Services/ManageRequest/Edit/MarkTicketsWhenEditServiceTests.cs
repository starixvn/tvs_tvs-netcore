using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;
using MarkTicketsService = TicketVoidingSystem.ManageRequest.Services.AddRequest.Add.MarkTicketsService;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class MarkTicketsWhenEditServiceTests
{
    private readonly MarkTicketsService markTicketsService;
    private readonly IDynamicRepository dynamicRepository;
    private readonly SessionService sessionService;
    private readonly MarkTicketsWhenAddEditServiceImp service;

    public MarkTicketsWhenEditServiceTests()
    {
        markTicketsService = Substitute.For<MarkTicketsService>();
        dynamicRepository = Substitute.For<IDynamicRepository>();
        sessionService = Substitute.For<SessionService>();
        service = new MarkTicketsWhenAddEditServiceImp(markTicketsService, sessionService, dynamicRepository);
    }

    [Fact]
    public async Task Execute_IssueTypeIsArchivedTicket_NotMarkUnMarkTickets()
    {
        // Arrange
        const string markTransIds = "1, 2, 3";
        const string unMarkTransIds = "4, 5, 6";
        const int issueTypeId = IssueTypeConstant.ArchivedTicket;
        var expected = new MarkTicketsResult
        {
            MarkedResults = new List<Result>(),
            MarkedTickets = new List<long>()
        };

        // Act
        var actual = await service.Execute(issueTypeId, markTransIds, unMarkTransIds);

        // Assert
        await markTicketsService.Received(0).MarkTicketsInTVS(markTransIds, issueTypeId, MarkTypeConstant.ExecuteMarkTickets);
        await markTicketsService.Received(0).MarkTicketsInTVS(unMarkTransIds, issueTypeId, MarkTypeConstant.ExecuteUnMarkTickets);
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task Execute_MarkTransIdsIsNull_NotMarkTickets()
    {
        // Arrange
        const string markTransIds = "";
        const string unMarkTransIds = "4, 5, 6";
        const int issueTypeId = IssueTypeConstant.DangerAccepted;
        var unmarkResults = new MarkTicketsResult { MarkedResults = new List<Result> { new() } };
        markTicketsService.MarkTicketsInTVS(unMarkTransIds, issueTypeId, MarkTypeConstant.ExecuteUnMarkTickets)
            .Returns(unmarkResults);

        var expected = new MarkTicketsResult
        {
            MarkedResults = new List<Result> { new() },
            MarkedTickets = new List<long>()
        };

        // Act
        var actual = await service.Execute(issueTypeId, markTransIds, unMarkTransIds);

        // Assert
        await markTicketsService.Received(0).MarkTicketsInTVS(markTransIds, issueTypeId, MarkTypeConstant.ExecuteMarkTickets);
        await markTicketsService.Received(1).MarkTicketsInTVS(unMarkTransIds, issueTypeId, MarkTypeConstant.ExecuteUnMarkTickets);
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task Execute_UnMarkTransIdsIsNull_NotMarkTickets()
    {
        // Arrange
        const string markTransIds = "1, 2, 3";
        const string unMarkTransIds = "";
        const int issueTypeId = IssueTypeConstant.DangerAccepted;
        var unmarkResults = new MarkTicketsResult { MarkedResults = new List<Result> { new() }, MarkedTickets = new List<long> { 4, 5, 6 } };
        markTicketsService.MarkTicketsInTVS(markTransIds, issueTypeId, MarkTypeConstant.ExecuteMarkTickets)
            .Returns(unmarkResults);

        var expected = new MarkTicketsResult
        {
            MarkedResults = new List<Result> { new() },
            MarkedTickets = new List<long> { 4, 5, 6 }
        };

        // Act
        var actual = await service.Execute(issueTypeId, markTransIds, unMarkTransIds);

        // Assert
        await markTicketsService.Received(1).MarkTicketsInTVS(markTransIds, issueTypeId, MarkTypeConstant.ExecuteMarkTickets);
        await markTicketsService.Received(0).MarkTicketsInTVS(unMarkTransIds, issueTypeId, MarkTypeConstant.ExecuteUnMarkTickets);
        AssertExtension.Equal(expected, actual);
    }
}