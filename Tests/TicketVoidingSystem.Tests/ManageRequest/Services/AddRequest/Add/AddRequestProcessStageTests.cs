using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Notification;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class AddRequestProcessStageTests
{
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly AccountWinLostService accountWinLostService;
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;
    private readonly GetUpdateResultService getUpdateResultService;
    private readonly AddRequestProcessStageImp service;

    public AddRequestProcessStageTests()
    {
        mapper = Substitute.For<IMapper>();
        var repository = Substitute.For<IDynamicRepository>();
        sessionService = Substitute.For<SessionService>();
        loggingService = Substitute.For<LoggingService>();
        accountWinLostService = Substitute.For<AccountWinLostService>();
        insertAutoVoidRequestQueueService = Substitute.For<InsertAutoVoidRequestQueueService>();
        var sendLetstalkAfterAddService = Substitute.For<SendLetstalkAfterAddService>();
        getUpdateResultService = Substitute.For<GetUpdateResultService>();
        var compressDataService = Substitute.For<CompressDataService>();
        var notificationService = Substitute.For<NotificationService>();
        service = new AddRequestProcessStageImp(mapper, repository, sessionService, accountWinLostService, insertAutoVoidRequestQueueService,
            sendLetstalkAfterAddService, getUpdateResultService, compressDataService, notificationService, null);
    }

    [Fact]
    public async Task Execute_IssueTypeIsWrongScore_AddRequestIsSuccessful()
    {
        // Arrange
        List<long> markedTicketsSuccessful = [1, 2];
        var query = new AddRequestQuery
        {
            IssueTypeId = 3,
            MatchId = 456,
            OperatorsList = [new OperatorQuery { OperatorId = 1 }],
            WrongScoreInfo = [new WrongScoreInfoViewModel
            {
                LogInfoDetail = new LogInfoDetail{HighlightMinTime = DateTimeOffset.MinValue.DateTime},
                FilterFromTransTime = DateTimeOffset.MinValue.DateTime,
                FilterToTransTime = DateTimeOffset.MinValue.DateTime,
                VoidFromTime = DateTimeOffset.MinValue.DateTime,
                VoidToTime = DateTimeOffset.MinValue.DateTime,
                MatchId = 456
            }]
        };

        mapper.Map<AddRequestCommand>(query).Returns(new AddRequestCommand { RequestId = 1 });
        sessionService.GetClientIp().Returns("127.00.17");
        insertAutoVoidRequestQueueService.GetMatchIdsInRequest(query.AbnormalBetInfo, query.EarlyKickOffInfo, query.WrongOfferedNameInfo);
        getUpdateResultService.CreateSuccessResult(1, "456").Returns(new Result());

        // Act
        var result = await service.Execute(query);

        // Assert
        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public async Task Execute_IssueTypeIsWrongHdp_AddRequestIsSuccessful()
    {
        // Arrange
        List<long> markedTicketsSuccessful = [1, 2];
        var query = new AddRequestQuery
        {
            IssueTypeId = 4,
            MatchId = 456,
            OperatorsList = [new OperatorQuery { OperatorId = 1 }],
            WrongHdpInfo = [new WrongHdpViewModel
            {
                LogInfoDetail = new LogInfoDetail{VoidFromTime = DateTimeOffset.MinValue.DateTime, VoidToTime = DateTimeOffset.MinValue.DateTime,},
                FilterFromTransTime = DateTimeOffset.MinValue.DateTime,
                FilterToTransTime = DateTimeOffset.MinValue.DateTime,
                MatchId = 456,
                IsMainMatch = true
            }]
        };

        mapper.Map<AddRequestCommand>(query).Returns(new AddRequestCommand { RequestId = 1 });
        sessionService.GetClientIp().Returns("127.00.17");
        insertAutoVoidRequestQueueService.GetMatchIdsInRequest(query.AbnormalBetInfo, query.EarlyKickOffInfo, query.WrongOfferedNameInfo);
        getUpdateResultService.CreateSuccessResult(1, "456").Returns(new Result());

        // Act
        var result = await service.Execute(query);

        // Assert
        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public async Task Execute_IssueTypeIsAbnormalAccount_AddRequestIsSuccessful()
    {
        // Arrange
        List<long> markedTicketsSuccessful = [1, 2];
        var query = new AddRequestQuery
        {
            IssueTypeId = 13,
            MatchId = 456,
            OperatorsList = [new OperatorQuery { OperatorId = 1 }],
            AbnormalAccountInfo = new AbnormalAccountViewModel
            {
                FromDate = DateTimeOffset.MinValue.DateTime,
                ToDate = DateTimeOffset.MinValue.DateTime,
                AccountWinlostModels = []
            },
            ActionId = ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId
        };

        mapper.Map<AddRequestCommand>(query).Returns(new AddRequestCommand { RequestId = 1 });
        sessionService.GetClientIp().Returns("127.00.17");
        insertAutoVoidRequestQueueService.GetMatchIdsInRequest(query.AbnormalBetInfo, query.EarlyKickOffInfo, query.WrongOfferedNameInfo);
        getUpdateResultService.CreateSuccessResult(1, "").Returns(new Result());

        // Act
        var result = await service.Execute(query);

        // Assert
        Assert.True(result.IsSuccessful);
        await accountWinLostService.Received(1).SaveAccountWinLost(1, query.ActionId, query.AbnormalAccountInfo.AccountWinlostModels);
    }

    [Fact]
    public async Task Execute_IssueTypeIsDangerAccepted_AddRequestIsSuccessful()
    {
        // Arrange
        List<long> markedTicketsSuccessful = [1, 2];
        var query = new AddRequestQuery
        {
            IssueTypeId = 1,
            MatchId = 456,
            OperatorsList = [new OperatorQuery { OperatorId = 1 }],
            DangerAcceptedInfo = [new DangerAcceptedViewModel
            {
                LogInfoDetail = new LogInfoDetail{TransVoidToTime = DateTimeOffset.MinValue.DateTime, HighlightMinTime = DateTimeOffset.MinValue.DateTime},
                FilterFromTransTime = DateTimeOffset.MinValue.DateTime,
                FilterToTransTime = DateTimeOffset.MinValue.DateTime,
                VoidFromTime = DateTimeOffset.MinValue.DateTime,
                VoidToTime = DateTimeOffset.MinValue.DateTime,
                MatchId = 456,
                IsMainMatch = true
            }]
        };

        mapper.Map<AddRequestCommand>(query).Returns(new AddRequestCommand { RequestId = 1 });
        sessionService.GetClientIp().Returns("127.00.17");
        insertAutoVoidRequestQueueService.GetMatchIdsInRequest(query.AbnormalBetInfo, query.EarlyKickOffInfo, query.WrongOfferedNameInfo);
        getUpdateResultService.CreateSuccessResult(1, "456").Returns(new Result());

        // Act
        var result = await service.Execute(query);

        // Assert
        Assert.True(result.IsSuccessful);
    }

    [Theory]
    [InlineData(5)]
    [InlineData(6)]
    [InlineData(7)]
    [InlineData(10)]
    [InlineData(2)]
    [InlineData(19)]
    [InlineData(23)]
    [InlineData(21)]
    [InlineData(8)]
    [InlineData(9)]
    [InlineData(11)]
    [InlineData(20)]
    [InlineData(12)]
    [InlineData(24)]
    [InlineData(25)]
    [InlineData(26)]
    public async Task Execute_ValidData_AddRequestIsSuccessful(int issueTypeId)
    {
        // Arrange
        List<long> markedTicketsSuccessful = [1, 2];
        var query = new AddRequestQuery
        {
            IssueTypeId = issueTypeId,
            MatchId = 456,
            OperatorsList = null,
            Wrong1stHdpInfo = [new WrongHdpViewModel { MatchId = 456, LogInfoDetail = new LogInfoDetail() }],
            WrongOuInfo = [new WrongOuViewModel { MatchId = 456, LogInfoDetail = new LogInfoDetail() }],
            Wrong1stOuInfo = [new WrongOuViewModel { MatchId = 456, LogInfoDetail = new LogInfoDetail() }],
            RedCardInfo = [new DangerAcceptedViewModel { MatchId = 456, LogInfoDetail = new LogInfoDetail(),
                FilterFromTransTime = DateTimeOffset.MinValue.DateTime, FilterToTransTime = DateTimeOffset.MinValue.DateTime,
                VoidFromTime = DateTimeOffset.MinValue.DateTime, VoidToTime = DateTimeOffset.MinValue.DateTime}],
            WrongOddsInfo = [new WrongOddsViewModel { MatchId = 456, LogInfoDetail = new LogInfoDetail(),
                FilterFromTransTime = DateTimeOffset.MinValue.DateTime, FilterToTransTime = DateTimeOffset.MinValue.DateTime}],
            ReducedOverInfo = [new ReducedOverViewModel { MatchId = 456, LogInfoDetail = new LogInfoDetail() }],
            NotParticipateInfo = [new NotParticipateViewModel { MatchId = 456, LogInfoDetail = new LogInfoDetail() }],
            EarlyKickOffInfo = [new EarlyKickOffViewModel { MatchId = 456, KickOffTime = DateTime.Now, IsMainMatch = true }],
            AbnormalBetInfo = new AbnormalBetViewModel { Matches = [new MatchInfoAddRequest { MatchId = 456 }] },
            DuplicateTicketsInfo = new DuplicateTicketsViewModel { MatchId = 456 },
            WrongMarketOfferedInfo = [new WrongMarketOfferedViewModel
            {
                MatchId = 456,
                FilterFromTransTime = DateTimeOffset.MinValue.DateTime,
                FilterToTransTime = DateTimeOffset.MinValue.DateTime,
                LogInfoDetail = new LogInfoDetail { VoidFromTime = DateTimeOffset.MinValue.DateTime, VoidToTime = DateTimeOffset.MinValue.DateTime },
                BetTypeCount = new List<BetTypeTicketsInfo> { new() },
                AllBetTypesSelection = []
            }],
            WrongOddsSportsBookInfo = new WrongOddsSportsBookViewModel
            {
                MatchId = 456,
                FilterFromTransTime = DateTimeOffset.MinValue.DateTime,
                FilterToTransTime = DateTimeOffset.MinValue.DateTime,
                LogInfoDetail = new LogInfoDetail()
            },
            WrongOfferedNameInfo = new WrongOfferedNameViewModel { MatchId = 456 },
            RecoverTicketInfo = new RecoverTicketViewModel()
        };

        mapper.Map<AddRequestCommand>(query).Returns(new AddRequestCommand { RequestId = 1 });
        sessionService.GetClientIp().Returns("127.00.17");
        insertAutoVoidRequestQueueService.GetMatchIdsInRequest(query.AbnormalBetInfo, query.EarlyKickOffInfo, query.WrongOfferedNameInfo);
        getUpdateResultService.CreateSuccessResult(1, "456").ReturnsForAnyArgs(new Result());

        // Act
        var result = await service.Execute(query);

        // Assert
        Assert.True(result.IsSuccessful);
    }
}