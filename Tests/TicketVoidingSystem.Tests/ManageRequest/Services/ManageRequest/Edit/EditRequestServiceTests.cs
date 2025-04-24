using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class EditRequestServiceTests
{
    private readonly MarkTicketsWhenAddEditService marketTicketsWhenEditService = Substitute.For<MarkTicketsWhenAddEditService>();
    private readonly GetUpdateResultService getUpdateResultService = Substitute.For<GetUpdateResultService>();
    private readonly ReCalculateTicketsService reCalculateTicketsService = Substitute.For<ReCalculateTicketsService>();
    private readonly UpdateRequestProcessStage updateRequestProcessStage = Substitute.For<UpdateRequestProcessStage>();

    [Fact]
    public async Task UpdateRequest_HasErrorMarkTicket_ReturnMarkTicketError()
    {
        // Arrange
        var query = new EditRequestQuery { MarkTransIds = "1,2,2", IssueTypeId = 1 };
        var markTicketResult = new MarkTicketsResult() { MarkedResults = [], MarkedTickets = [] };
        var resultMarkTicket = new Result { ErrorMsg = "Has Error Mark Tickets", ErrorCode = 1 };
        marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds).Returns(markTicketResult);
        getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService)).Returns(resultMarkTicket);
        var service = new EditRequestServiceImp(marketTicketsWhenEditService, null, null, getUpdateResultService, null, null);

        // Act
        var result = await service.UpdateRequest(query);

        // Assert

        AssertExtension.Equal(resultMarkTicket, result);
    }

    [Fact]
    public async Task UpdateRequest_HasErrorReCalcTicket_ReturnReCalcTicketError()
    {
        // Arrange
        var query = new EditRequestQuery { MarkTransIds = "1,2,2", IssueTypeId = 1 };
        var markTicketResult = new MarkTicketsResult() { MarkedResults = [], MarkedTickets = [] };
        var reCalcTicketError = new Result { ErrorMsg = "Has Error ReCalculate Ticket", ErrorCode = 1 };
        List<Result> reCalcTicketsAbnormalResults = [new()];
        marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds).Returns(markTicketResult);
        getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService)).Returns((Result)null);
        reCalculateTicketsService.Execute(query.AbnormalBetInfo, query.IssueTypeId, query.RemoveTransIds).Returns(reCalcTicketsAbnormalResults);
        getUpdateResultService.GetFirstError(reCalcTicketsAbnormalResults, nameof(ReCalculateTicketsService)).Returns(reCalcTicketError);
        var service = new EditRequestServiceImp(marketTicketsWhenEditService, reCalculateTicketsService, null, getUpdateResultService, null, null);

        // Act
        var result = await service.UpdateRequest(query);

        // Assert
        AssertExtension.Equal(reCalcTicketError, result);
    }

    [Fact]
    public async Task UpdateRequest_NoHasError_UpdateRequestStage()
    {
        // Arrange
        var query = new EditRequestQuery { MarkTransIds = "1,2,2", IssueTypeId = 1 };
        var markTicketResult = new MarkTicketsResult { MarkedResults = [], MarkedTickets = [] };
        List<Result> reCalcTicketsAbnormalResults = [new()];
        marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds).Returns(markTicketResult);
        getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService)).Returns((Result)null);
        reCalculateTicketsService.Execute(query.AbnormalBetInfo, query.IssueTypeId, query.RemoveTransIds).Returns(reCalcTicketsAbnormalResults);
        getUpdateResultService.GetFirstError(reCalcTicketsAbnormalResults, nameof(ReCalculateTicketsService)).Returns((Result)null);
        var service = new EditRequestServiceImp(marketTicketsWhenEditService, reCalculateTicketsService, updateRequestProcessStage, getUpdateResultService, null, null);

        // Act
        _ = await service.UpdateRequest(query);

        // Assert

        await updateRequestProcessStage.Received(1).Execute(query);
    }
}