using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LogInfo;

public class LogInfoServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly LogInfoServiceImp service;
    private readonly SessionService session;
    private readonly GetVoidTimeByAllowanceSettingService getVoidTimeByAllowanceSettingService;

    public LogInfoServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        repository = Substitute.For<IDynamicRepository>();
        session = Substitute.For<SessionService>();
        getVoidTimeByAllowanceSettingService = Substitute.For<GetVoidTimeByAllowanceSettingService>();
        var betListService = Substitute.For<BetListService>();
        var copyRequestInfoService = Substitute.For<CopyRequestInfoService>();
        service = new LogInfoServiceImp(mapper, repository, session, betListService, copyRequestInfoService, getVoidTimeByAllowanceSettingService);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeIsWrongScore_ReturnWrongScoreInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.WrongScore;
        const int userId = 1234;
        const int scoreId = 62122;
        const int matchId = 996063;
        var validation = new Validation { ScoreId = scoreId, MatchId = matchId };
        var validations = new List<Validation> { validation };
        var ticketRequest = new TicketRequest { ScoreId = scoreId, RequestId = 3333, MatchId = matchId };
        var ticketRequests = new List<TicketRequest> { ticketRequest };
        var logInfo = new LogInfoDetail { ScoreId = scoreId, MatchId = matchId };
        var logInfos = new List<LogInfoDetail> { logInfo };
        var transInfoAddRequestModels = new List<TransInfoAddRequestModel>();
        var betTypeCountModel = new List<BetTypeTicketsInfo> { new() };
        var dateTime = DateTimeOffset.Now.DateTime;

        var viewModel = new WrongScoreInfoViewModel
        {
            ActualScore = "1-1",
            EventDate = DateTimeOffset.Now.DateTime,
            FilterFromTransTime = DateTimeOffset.Now.DateTime,
            FilterToTransTime = DateTimeOffset.Now.DateTime,
            MatchId = matchId,
            SubIssueTypeId = 7,
            ScoreId = scoreId,
            WrongScore = "0-1"
        };
        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            WrongScoreModels = new List<WrongScoreInfoViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTimeOffset.Now.DateTime
        };
        var voidTimeByAllowanceSetting = new List<VoidTimeByAllowanceSetting>
        {
            new()
            {
                ScoreId = scoreId,
                VoidFromTime = dateTime,
                VoidToTime = dateTime
            },
        };
        getVoidTimeByAllowanceSettingService.Get(default).ReturnsForAnyArgs(voidTimeByAllowanceSetting);
        repository.FetchMultipleAsync<Validation, TicketRequest, LogInfoDetail, TransInfoAddRequestModel, BetTypeTicketsInfo>(default)
            .ReturnsForAnyArgs((validations, ticketRequests, logInfos, transInfoAddRequestModels, betTypeCountModel));
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(default).ReturnsForAnyArgs(new GetLogInfoCriteria());

        // Act
        var actual = await service.Get(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation.MatchId, logInfoModel.Validation.MatchId);
        Assert.Equal(ticketRequests.Count, logInfoModel.TicketRequest.Count());
        Assert.Equal(logInfo.MatchId, logInfoModel.LogInfoDetail.MatchId);
    }

    [Theory]
    [InlineData(IssueTypeConstant.EarlyKickOffTime)]
    [InlineData(IssueTypeConstant.WrongKickOffTime)]
    [InlineData(IssueTypeConstant.NotParticipate)]
    [InlineData(IssueTypeConstant.ReducedOver)]
    [InlineData(IssueTypeConstant.WrongOdds)]
    [InlineData(IssueTypeConstant.WrongOU)]
    [InlineData(IssueTypeConstant.Wrong1stHDP)]
    [InlineData(IssueTypeConstant.Wrong1stOU)]
    [InlineData(IssueTypeConstant.WrongHDP)]
    [InlineData(IssueTypeConstant.RedCard)]
    [InlineData(IssueTypeConstant.DangerAccepted)]
    public async Task GetLogInfo_CalledExpected(int issueTypeId)
    {
        // Arrange
        const int userId = 1234;
        const int scoreId = 62122;
        const int matchId = 996063;
        var validation = new Validation { ScoreId = scoreId, MatchId = matchId };
        var validations = new List<Validation> { validation };
        var ticketRequest = new TicketRequest { ScoreId = scoreId, RequestId = 3333, MatchId = matchId };
        var ticketRequests = new List<TicketRequest> { ticketRequest };
        var logInfo = new LogInfoDetail { ScoreId = scoreId, MatchId = matchId };
        var logInfos = new List<LogInfoDetail> { logInfo };
        var transInfoAddRequestModels = new List<TransInfoAddRequestModel>
            { new() { MarkTransIds = "1232" } };
        var betTypeCountModel = new List<BetTypeTicketsInfo> { new() };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            MatchId = matchId,
            KickOffTime = DateTimeOffset.Now.DateTime,
            EarlyKickOffModels = new List<EarlyKickOffViewModel> { new() { MatchId = matchId } },
            NotParticipateModels = new List<NotParticipateViewModel> { new() { MatchId = matchId } },
            ReducedOverModels = new List<ReducedOverViewModel> { new() { MatchId = matchId } },
            WrongOddsModels = new List<WrongOddsViewModel> { new() { MatchId = matchId } },
            WrongOuModels = new List<WrongOuViewModel> { new() { MatchId = matchId } },
            Wrong1stOuModels = new List<WrongOuViewModel> { new() { MatchId = matchId } },
            Wrong1stHdpModels = new List<WrongHdpViewModel> { new() { MatchId = matchId } },
            WrongHdpModels = new List<WrongHdpViewModel> { new() { MatchId = matchId } },
            RedCardModels = new List<DangerAcceptedViewModel> { new() { MatchId = matchId } },
            DangerAcceptedModels = new List<DangerAcceptedViewModel> { new() { MatchId = matchId } }
        };
        repository.FetchMultipleAsync<Validation, TicketRequest, LogInfoDetail, TransInfoAddRequestModel, BetTypeTicketsInfo>(Arg.Any<GetLogInfoCriteria>())
            .ReturnsForAnyArgs((validations, ticketRequests, logInfos, transInfoAddRequestModels, betTypeCountModel));
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());

        // Act
        var actual = await service.Get(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Equal(validation.MatchId, logInfoModel.Validation.MatchId);
        Assert.Equal(ticketRequests.Count, logInfoModel.TicketRequest.Count());
        Assert.Equal(logInfo.MatchId, logInfoModel.LogInfoDetail.MatchId);
    }

    [Fact]
    public async Task GetLogInfo_EarlyKickOffTimeHasMatchExpect_CalledExpected()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.EarlyKickOffTime;
        const int userId = 1234;
        const int scoreId = 62122;
        const int matchId = 74560781;
        var validation = new Validation { ScoreId = scoreId, MatchId = matchId };
        var validations = new List<Validation> { validation };
        var ticketRequest = new TicketRequest { ScoreId = scoreId, RequestId = 3333, MatchId = matchId };
        var ticketRequests = new List<TicketRequest> { ticketRequest };
        var logInfo = new LogInfoDetail { ScoreId = scoreId, MatchId = matchId };
        var logInfos = new List<LogInfoDetail> { logInfo };
        var transInfoAddRequestModels = new List<TransInfoAddRequestModel>
            { new() { MarkTransIds = "1232" } };
        var betTypeCountModel = new List<BetTypeTicketsInfo> { new() };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            MatchId = matchId,
            KickOffTime = DateTimeOffset.Now.DateTime,
            EarlyKickOffModels = new List<EarlyKickOffViewModel> { new() { MatchId = matchId } },
            NotParticipateModels = new List<NotParticipateViewModel> { new() { MatchId = matchId } }
        };
        repository.FetchMultipleAsync<Validation, TicketRequest, LogInfoDetail, TransInfoAddRequestModel, BetTypeTicketsInfo>(Arg.Any<GetLogInfoCriteria>())
            .ReturnsForAnyArgs((validations, ticketRequests, logInfos, transInfoAddRequestModels, betTypeCountModel));
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());

        // Act
        var actual = await service.Get(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Equal(validation.MatchId, logInfoModel.Validation.MatchId);
        Assert.Equal(ticketRequests.Count, logInfoModel.TicketRequest.Count());
        Assert.Equal(logInfo.MatchId, logInfoModel.LogInfoDetail.MatchId);
    }
}