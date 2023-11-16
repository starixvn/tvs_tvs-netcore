using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
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
    private readonly AccountWinLostService accountWinLostService;
    private UpdateRequestProcessStageImp service;

    public UpdateRequestProcessStageTests()
    {
        mapper = Substitute.For<IMapper>();
        sessionService = Substitute.For<SessionService>();
        repository = Substitute.For<IDynamicRepository>();
        accountWinLostService = Substitute.For<AccountWinLostService>();
        insertAutoVoidRequestQueueService = Substitute.For<InsertAutoVoidRequestQueueService>();
        service = new UpdateRequestProcessStageImp(mapper, repository, accountWinLostService, sessionService,
            insertAutoVoidRequestQueueService);
    }

    [Fact]
    public async Task Execute_ValidData_HasCalledExpected()
    {
        // Arrange
        var query = new EditRequestQuery
        {
            RequestId = 1,
            ActionId = 1,
            MatchId = 1,
            OperatorsList = new List<OperatorQuery> { new() },
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
            DuplicateTicketsInfo = new DuplicateTicketsViewModel(),
            NotParticipateInfo = new List<NotParticipateViewModel>(),
            EarlyKickOffInfo = new List<EarlyKickOffViewModel>(),
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
        await insertAutoVoidRequestQueueService.Received(1).Execute(query.RequestId, query.ActionId, Arg.Any<IEnumerable<EarlyKickOffViewModel>>());
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
            KickOffTime = DateTime.Now,
            OperatorsList = null
        };

        mapper.Map<EditRequestCommand>(Arg.Any<EditRequestQuery>())
            .ReturnsForAnyArgs(new EditRequestCommand { RequestId = 1 });
        service = new UpdateRequestProcessStageImp(mapper, repository, accountWinLostService, sessionService, null);

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.Equal(1, actual.ErrorCode);
    }
}