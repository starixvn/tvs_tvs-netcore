using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class EditRequestServiceTests
{
    private readonly LoggingService loggingService;
    private readonly MarkTicketsWhenAddEditService marketTicketsWhenEditService;
    private readonly EditRequestServiceImp service;
    private readonly UpdateRequestProcessStage updateRequestProcessStage;

    public EditRequestServiceTests()
    {
        loggingService = Substitute.For<LoggingService>();
        marketTicketsWhenEditService = Substitute.For<MarkTicketsWhenAddEditService>();
        var reCalculateTicketsService = Substitute.For<ReCalculateTicketsService>();
        updateRequestProcessStage = Substitute.For<UpdateRequestProcessStage>();
        service = new EditRequestServiceImp(loggingService, marketTicketsWhenEditService, reCalculateTicketsService,
            updateRequestProcessStage);
    }

    [Theory]
    [InlineData(IssueTypeConstant.ArchivedTicket, "1", true)]
    [InlineData(IssueTypeConstant.AbnormalBet, "1", true)]
    public async Task UpdateRequest_ValidData_ReturnExpected(int issueTypeId, string removeTransIds,
        bool isConfirmCalculator)
    {
        // Arrange
        var query = new EditRequestQuery
        {
            IssueTypeId = issueTypeId,
            RemoveTransIds = removeTransIds,
            AbnormalBetInfo = new AbnormalBetViewModel { IsConfirmCalculator = isConfirmCalculator },
            MatchId = 1
        };
        var markTicketResults = new List<Result> { new() };
        var expected = new Result();

        marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds).ReturnsForAnyArgs(markTicketResults);
        updateRequestProcessStage.Execute(query).ReturnsForAnyArgs(expected);

        // Act
        var actual = await service.UpdateRequest(query);

        // Assert
        await updateRequestProcessStage.Received(1).Execute(query);
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task UpdateRequest_HasException_ReturnErrorCodeExpected()
    {
        // Arrange
        var query = new EditRequestQuery
        {
            IssueTypeId = IssueTypeConstant.AbnormalBet,
            MatchId = 1
        };

        marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds).Throws(new Exception());

        // Act
        var actual = await service.UpdateRequest(query);

        // Assert
        await loggingService.Received(1).ErrorAsync(Arg.Any<Exception>());
        Assert.Equal(1, actual.ErrorCode);
    }
}