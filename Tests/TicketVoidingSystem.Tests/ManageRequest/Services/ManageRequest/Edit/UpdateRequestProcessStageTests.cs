using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class UpdateRequestProcessStageTests
{
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private UpdateRequestProcessStageImp service;

    public UpdateRequestProcessStageTests()
    {
        mapper = Substitute.For<IMapper>();
        sessionService = Substitute.For<SessionService>();
        repository = Substitute.For<IDynamicRepository>();
        insertAutoVoidRequestQueueService = Substitute.For<InsertAutoVoidRequestQueueService>();
        service = new UpdateRequestProcessStageImp(mapper, repository, sessionService,
            insertAutoVoidRequestQueueService);
    }

    [Fact]
    public async Task Execute_ValidData_HasCalledExpected()
    {
        // Arrange
        var query = new EditRequestQuery
        {
            RequestId = 1, ActionId = 1, MatchId = 1, OperatorsList = new List<OperatorQuery>(),
            WrongScoreInfo = new List<WrongScoreInfoViewModel>(),
            WrongOuInfo = new List<WrongOuViewModel>(),
            Wrong1stOuInfo = new List<WrongOuViewModel>(),
            WrongHdpInfo = new List<WrongHdpViewModel>(),
            Wrong1stHdpInfo = new List<WrongHdpViewModel>(),
            WrongOddsInfo = new List<WrongOddsViewModel>(),
            ReducedOverInfo = new List<ReducedOverViewModel>(),
            DangerAcceptedInfo = new List<DangerAcceptedViewModel>(),
            RedCardInfo = new List<DangerAcceptedViewModel>(),
            AbnormalAccountInfo = new AbnormalAccountViewModel(),
            DuplicateTicketsInfo = new DuplicateTicketsViewModel()
        };
        var expected = new Result
        {
            Data = new
            {
                query.MatchId,
                query.RequestId
            }
        };
        mapper.Map<EditRequestCommand>(Arg.Any<EditRequestQuery>())
            .ReturnsForAnyArgs(new EditRequestCommand { RequestId = 1 });

        // Act
        var actual = await service.Execute(query);

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<EditRequestCommand>());
        await insertAutoVoidRequestQueueService.Received(1).Execute(query.RequestId, query.ActionId, null);
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task Execute_HasException_ReturnErrorCodeExpected()
    {
        // Arrange
        var query = new EditRequestQuery
        {
            IssueTypeId = IssueTypeConstant.EarlyKickOffTime,
            RequestId = 1,
            ActionId = 1,
            MatchId = 1,
            OperatorsList = null,
            WrongScoreInfo = null,
            WrongOuInfo = null,
            Wrong1stOuInfo = null,
            WrongHdpInfo = null,
            Wrong1stHdpInfo = null,
            WrongOddsInfo = null,
            ReducedOverInfo = null,
            DangerAcceptedInfo = null,
            RedCardInfo = null,
            AbnormalAccountInfo = null,
            DuplicateTicketsInfo = null,
            KickOffTime = DateTime.Now
        };

        mapper.Map<EditRequestCommand>(Arg.Any<EditRequestQuery>())
            .ReturnsForAnyArgs(new EditRequestCommand { RequestId = 1 });
        service = new UpdateRequestProcessStageImp(mapper, repository, sessionService, null);

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.Equal(1, actual.ErrorCode);
    }
}