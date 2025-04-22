using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class AddRequestServiceTests
{
    private readonly AddRequestProcessStage addRequestProcessStage;
    private readonly MarkTicketsWhenAddEditService marketTicketsWhenEditService;
    private readonly GetUpdateResultService getUpdateResultService;
    private readonly AddRequestServiceImp service;

    public AddRequestServiceTests()
    {
        addRequestProcessStage = Substitute.For<AddRequestProcessStage>();
        marketTicketsWhenEditService = Substitute.For<MarkTicketsWhenAddEditService>();
        getUpdateResultService = Substitute.For<GetUpdateResultService>();
        service = new AddRequestServiceImp(addRequestProcessStage, marketTicketsWhenEditService, getUpdateResultService, null, null);
    }

    [Fact]
    public async Task Execute_HasMarkTicketError_ReturnExpected()
    {
        // Arrange
        var query = new AddRequestQuery
        {
            IssueTypeId = 1,
            MarkTransIds = "1,2,3",
            UnMarkTransIds = "1"
        };
        var markTicketsResult = new MarkTicketsResult
        {
            MarkedResults = [],
            MarkedTickets = []
        };
        marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds).Returns(markTicketsResult);
        var result = new Result { ErrorCode = 1, ErrorMsg = "has error" };
        getUpdateResultService.GetFirstError(markTicketsResult.MarkedResults, nameof(MarkTicketsWhenAddEditService), markTicketsResult.MarkedTickets).Returns(result);

        // Act
        var actual = await service.Execute(query);

        // Assert
        AssertExtension.Equal(result, actual);
    }

    [Fact]
    public async Task Execute_MarkTicketsSuccessful_ReturnExpected()
    {
        // Arrange
        var query = new AddRequestQuery
        {
            IssueTypeId = 1,
            MarkTransIds = "1,2,3",
            UnMarkTransIds = "1"
        };
        var markTicketsResult = new MarkTicketsResult
        {
            MarkedResults = [],
            MarkedTickets = []
        };
        marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds).Returns(markTicketsResult);
        var result = new Result { ErrorCode = 1, ErrorMsg = "has error" };
        getUpdateResultService.GetFirstError(markTicketsResult.MarkedResults, nameof(MarkTicketsWhenAddEditService), markTicketsResult.MarkedTickets).Returns((Result)null);
        addRequestProcessStage.Execute(query, markTicketsResult.MarkedTickets).Returns(result);

        // Act
        var actual = await service.Execute(query);

        // Assert
        AssertExtension.Equal(result, actual);
        await addRequestProcessStage.Received(1).Execute(query, markTicketsResult.MarkedTickets);
    }
}