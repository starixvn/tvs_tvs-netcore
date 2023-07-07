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
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest;

public class LogInfoServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly LogInfoServiceImp service;
    private readonly SessionService session;

    public LogInfoServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        repository = Substitute.For<IDynamicRepository>();
        session = Substitute.For<SessionService>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        service = new LogInfoServiceImp(mapper, repository, session, getTransInfoService);
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new WrongScoreInfoViewModel
        {
            ActualScore = "1-1",
            EventDate = new DateTime(2020, 06, 16),
            FilterFromTransTime = new DateTime(2020, 06, 15),
            FilterToTransTime = new DateTime(2020, 06, 17),
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
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeIsDangerAccepted_ReturnDangerAcceptedInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.DangerAccepted;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new DangerAcceptedViewModel
        {
            EventDate = new DateTime(2020, 06, 16),
            FilterFromTransTime = new DateTime(2020, 06, 15),
            FilterToTransTime = new DateTime(2020, 06, 17),
            MatchId = matchId,
            SubIssueTypeId = 7
        };
        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            DangerAcceptedModels = new List<DangerAcceptedViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeIsRedCard_ReturnRedCardInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.RedCard;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new DangerAcceptedViewModel
        {
            EventDate = new DateTime(2020, 06, 16),
            FilterFromTransTime = new DateTime(2020, 06, 15),
            FilterToTransTime = new DateTime(2020, 06, 17),
            MatchId = matchId,
            SubIssueTypeId = 7
        };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            RedCardModels = new List<DangerAcceptedViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }
    

    [Fact]
    public async Task GetLogInfo_IssueTypeIsWrongHdp_ReturnWrongHdpInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.WrongHDP;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new WrongHdpViewModel
        {
            EventDate = new DateTime(2020, 06, 16),
            FilterFromTransTime = new DateTime(2020, 06, 15),
            FilterToTransTime = new DateTime(2020, 06, 17),
            MatchId = matchId,
            SubIssueTypeId = 7
        };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            WrongHdpModels = new List<WrongHdpViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeIsWrong1stHDP_ReturnWrong1stHDPInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.Wrong1stHDP;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new WrongHdpViewModel
        {
            EventDate = new DateTime(2020, 06, 16),
            FilterFromTransTime = new DateTime(2020, 06, 15),
            FilterToTransTime = new DateTime(2020, 06, 17),
            MatchId = matchId,
            SubIssueTypeId = 7
        };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            Wrong1stHdpModels = new List<WrongHdpViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeIsWrong1stOu_ReturnWrong1stOUInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.Wrong1stOU;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new WrongOuViewModel
        {
            EventDate = new DateTime(2020, 06, 16),
            FilterFromTransTime = new DateTime(2020, 06, 15),
            FilterToTransTime = new DateTime(2020, 06, 17),
            MatchId = matchId,
            SubIssueTypeId = 7
        };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            Wrong1stOuModels = new List<WrongOuViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeIsWrongOu_ReturnWrongOuInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.WrongOU;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new WrongOuViewModel
        {
            EventDate = new DateTime(2020, 06, 16),
            FilterFromTransTime = new DateTime(2020, 06, 15),
            FilterToTransTime = new DateTime(2020, 06, 17),
            MatchId = matchId,
            SubIssueTypeId = 7
        };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            WrongOuModels = new List<WrongOuViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeIsWrongOdds_ReturnWrongOddsInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.WrongOdds;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new WrongOddsViewModel
        {
            EventDate = new DateTime(2020, 06, 16),
            FilterFromTransTime = new DateTime(2020, 06, 15),
            FilterToTransTime = new DateTime(2020, 06, 17),
            MatchId = matchId,
            SubIssueTypeId = 7
        };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            WrongOddsModels = new List<WrongOddsViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeConstantNotContainIssueTypeInput_ReturnLogInfoViewModelDefault()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.EarlyKickOffTime;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }

    [Fact]
    public async Task GetLogInfo_IssueTypeIsReducedOver_ReturnReducedOverInfoViewModel()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.ReducedOver;
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
        var transInfoModels = new List<string> { "123" };
        var mappingTypes = new[]
        {
            typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
            typeof(string)
        };

        IEnumerable<object>[] fakeData =
            { validations, ticketRequests, logInfos, transInfoAddRequestModels, transInfoModels };

        var viewModel = new ReducedOverViewModel()
        {
            EventDate = new DateTime(2020, 06, 16),
            MatchId = matchId,
            SubIssueTypeId = 7
        };
        var request = new GetLogInfoRequest
        {
            IssueTypeId = issueTypeId,
            ReducedOverModels = new List<ReducedOverViewModel> { viewModel },
            MatchId = matchId,
            KickOffTime = DateTime.Now
        };
        repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
        session.UserId.ReturnsForAnyArgs(userId);
        mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
        var transInfoJson = new List<string> { issueTypeId.ToString() };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);

        // Act
        var actual = await service.GetLogInfo(request);
        var logInfoModel = actual.GetLogInfoModels.ToList()[0];

        // Assert
        Assert.Single(actual.GetLogInfoModels);
        Assert.Equal(validation, logInfoModel.Validation);
        Assert.Equal(ticketRequests, logInfoModel.TicketRequest);
        Assert.Equal(logInfo, logInfoModel.LogInfoDetail);
    }
}