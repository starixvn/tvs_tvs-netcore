using System;
using System.Collections.Generic;
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
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;


namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest
{
    public class LogInfoServiceTests
    {
        private readonly IMapper mapper;
        private readonly IDynamicRepository repository;
        private readonly SessionService session;
        private readonly GetTransInfoService getTransInfoService;
        private readonly LogInfoServiceImp service;

        public LogInfoServiceTests()
        {
            mapper = Substitute.For<IMapper>();
            repository = Substitute.For<IDynamicRepository>();
            session = Substitute.For<SessionService>();
            getTransInfoService = Substitute.For<GetTransInfoService>();
            service = new LogInfoServiceImp(mapper, repository, session, getTransInfoService);
        }

        // [Fact]
        // public async Task GetLogInfo_IsWrongScore_ReturnResult()
        // {
        //     // Arrange
        //     const int userId = 1234;
        //     const int scoreId = 62122;
        //     const int matchId = 996063;
        //     var validations = new List<Validation> {new Validation {ScoreId = scoreId}};
        //     var ticketRequests = new List<TicketRequest> {new TicketRequest {ScoreId = scoreId, RequestId = 3333}};
        //     var logInfo = new List<LogInfoDetail> {new LogInfoDetail {ScoreId = scoreId}};
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel>
        //         {new TransInfoAddRequestModel {MarkTransIds = "1232"}};
        //     var transInfoModels = new List<string> {{"123"}};
        //     var mappingTypes = new[]
        //     {
        //         typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel),
        //         typeof(GetTicketSiteDbModel)
        //     };
        //     IEnumerable<object>[] fakeData =
        //         {validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels};
        //     var getLogInfoModel = new GetLogInfoModel
        //     {
        //         LogInfoDetail = logInfo[0],
        //         Validation = validations[0],
        //         TicketRequest = ticketRequests
        //     };
        //     var expected = new GetLogInfoViewModel
        //     {
        //         GetLogInfoModels = new List<GetLogInfoModel> {getLogInfoModel},
        //         TransInfoAddRequestModel = new TransInfoAddRequestModel()
        //     };
        //     var wrongScoreInfoViewModel = new WrongScoreInfoViewModel
        //     {
        //         ActualScore = "1-1",
        //         EventDate = new DateTime(2020, 06, 16),
        //         FilterFromTransTime = new DateTime(2020, 06, 15),
        //         FilterToTransTime = new DateTime(2020, 06, 17),
        //         MatchId = matchId,
        //         SubIssueTypeId = 7,
        //         ScoreId = scoreId,
        //         WrongScore = "0-1"
        //     };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = IssueTypeConstant.WrongScore,
        //         WrongScoreModels = new List<WrongScoreInfoViewModel> {wrongScoreInfoViewModel}
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     session.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();

        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.NotNull(actual);
        // }

        // [Fact]
        // public async Task GetLogInfo_IsDangerAccepted_ReturnResult()
        // {
        //     // Arrange
        //     const int matchId = 996063;
        //     var validations = new List<Validation> { new Validation { MatchId = matchId } };
        //     var ticketRequests = new List<TicketRequest> { new TicketRequest { MatchId = matchId, RequestId = 3333 } };
        //     var logInfo = new List<LogInfoDetail> { new LogInfoDetail { MatchId = matchId } };
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel> { new TransInfoAddRequestModel { MarkTransIds = "1232" } };
        //     var transInfoModels = new List<string> { { "123" } };
        //     var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(GetTicketSiteDbModel) };
        //     IEnumerable<object>[] fakeData = { validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels };
        //     var getLogInfoModel = new GetLogInfoModel
        //     {
        //         LogInfoDetail = logInfo[0],
        //         Validation = validations[0],
        //         TicketRequest = ticketRequests
        //     };
        //     var expected = new GetLogInfoViewModel
        //     {
        //         GetLogInfoModels = new List<GetLogInfoModel> { getLogInfoModel },
        //         TransInfoAddRequestModel = new TransInfoAddRequestModel()
        //     };
        //     var dangerAcceptedViewModel = new DangerAcceptedViewModel
        //     {
        //         IssueTypeId = IssueTypeConstant.DangerAccepted,
        //         EventDate = new DateTime(2020, 06, 16),
        //         FilterFromTransTime = new DateTime(2020, 06, 15),
        //         FilterToTransTime = new DateTime(2020, 06, 17),
        //         MatchId = matchId,
        //         SubIssueTypeId = 1,
        //     };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = IssueTypeConstant.DangerAccepted,
        //         DangerAcceptedModels = new List<DangerAcceptedViewModel> { dangerAcceptedViewModel }
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     const int userId = 1234;
        //     var sessionService = Substitute.For<ISessionService>();
        //     sessionService.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();
        //     var service = new LogInfoServiceImp(repository, sessionService, transInfoService);

        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.Equal(expected.GetLogInfoModels[0].LogInfoDetail,
        //         actual.GetLogInfoModels[0].LogInfoDetail);
        //     Assert.Equal(expected.GetLogInfoModels[0].Validation, actual.GetLogInfoModels[0].Validation);
        //     Assert.Equal(expected.GetLogInfoModels[0].TicketRequest,
        //         actual.GetLogInfoModels[0].TicketRequest);
        // }

        // [Fact]
        // public async Task GetLogInfo_IsRedCard_ReturnResult()
        // {
        //     // Arrange
        //     const int matchId = 996063;
        //     var validations = new List<Validation> { new Validation { MatchId = matchId } };
        //     var ticketRequests = new List<TicketRequest> { new TicketRequest { MatchId = matchId, RequestId = 3333 } };
        //     var logInfo = new List<LogInfoDetail> { new LogInfoDetail { MatchId = matchId } };
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel> { new TransInfoAddRequestModel { MarkTransIds = "1232" } };
        //     var transInfoModels = new List<string> { { "123" } };
        //     var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(GetTicketSiteDbModel) };
        //     IEnumerable<object>[] fakeData = { validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels };
        //     var getLogInfoModel = new GetLogInfoModel
        //     {
        //         LogInfoDetail = logInfo[0],
        //         Validation = validations[0],
        //         TicketRequest = ticketRequests
        //     };
        //     var expected = new GetLogInfoViewModel
        //     {
        //         GetLogInfoModels = new List<GetLogInfoModel> { getLogInfoModel },
        //         TransInfoAddRequestModel = new TransInfoAddRequestModel()
        //     };

        //     var redCardModels = new DangerAcceptedViewModel
        //     {
        //         IssueTypeId = IssueTypeConstant.RedCard,
        //         EventDate = new DateTime(2020, 06, 16),
        //         FilterFromTransTime = new DateTime(2020, 06, 15),
        //         FilterToTransTime = new DateTime(2020, 06, 17),
        //         MatchId = matchId,
        //         SubIssueTypeId = 1,
        //     };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = IssueTypeConstant.RedCard,
        //         MatchId = matchId,
        //         SubIssueTypeId = 10,
        //         RedCardModels = new List<DangerAcceptedViewModel> { redCardModels }
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     const int userId = 1234;
        //     var sessionService = Substitute.For<ISessionService>();
        //     sessionService.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();
        //     var service = new LogInfoServiceImp(repository, sessionService, transInfoService);

        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.Equal(expected.GetLogInfoModels[0].LogInfoDetail,
        //         actual.GetLogInfoModels[0].LogInfoDetail);
        //     Assert.Equal(expected.GetLogInfoModels[0].Validation, actual.GetLogInfoModels[0].Validation);
        //     Assert.Equal(expected.GetLogInfoModels[0].TicketRequest,
        //         actual.GetLogInfoModels[0].TicketRequest);
        // }

        // [Fact]
        // public async Task GetLogInfo_IsOthers_ReturnResult()
        // {
        //     // Arrange
        //     const int matchId = 996063;
        //     var validations = new List<Validation> { new Validation { MatchId = matchId } };
        //     var ticketRequests = new List<TicketRequest> { new TicketRequest { MatchId = matchId, RequestId = 3333 } };
        //     var logInfo = new List<LogInfoDetail> { new LogInfoDetail { MatchId = matchId } };
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel> { new TransInfoAddRequestModel { MarkTransIds = "1232" } };
        //     var transInfoModels = new List<string> { { "123" } };
        //     var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(GetTicketSiteDbModel) };
        //     IEnumerable<object>[] fakeData = { validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels };
        //     var getLogInfoModel = new GetLogInfoModel
        //     {
        //         LogInfoDetail = logInfo[0],
        //         Validation = validations[0],
        //         TicketRequest = ticketRequests
        //     };
        //     var expected = new GetLogInfoViewModel
        //     {
        //         GetLogInfoModels = new List<GetLogInfoModel> { getLogInfoModel },
        //         TransInfoAddRequestModel = new TransInfoAddRequestModel()
        //     };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = 12,
        //         MatchId = matchId,
        //         SubIssueTypeId = 10,
        //         RedCardModels = null
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     const int userId = 1234;
        //     var sessionService = Substitute.For<ISessionService>();
        //     sessionService.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();
        //     var service = new LogInfoServiceImp(repository, sessionService, transInfoService);

        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.Equal(expected.GetLogInfoModels[0].LogInfoDetail,
        //         actual.GetLogInfoModels[0].LogInfoDetail);
        //     Assert.Equal(expected.GetLogInfoModels[0].Validation, actual.GetLogInfoModels[0].Validation);
        //     Assert.Equal(expected.GetLogInfoModels[0].TicketRequest,
        //         actual.GetLogInfoModels[0].TicketRequest);
        // }

        // [Fact]
        // public async Task GetLogInfo_IssueTypeIsNull_ReturnResult()
        // {
        //     // Arrange
        //     const int userId = 1234;
        //     const int matchId = 996063;
        //     var validations = new List<Validation> { new Validation { MatchId = matchId } };
        //     var ticketRequests = new List<TicketRequest> { new TicketRequest { MatchId = matchId, RequestId = 3333 } };
        //     var logInfo = new List<LogInfoDetail> { new LogInfoDetail { MatchId = matchId } };
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel> { new TransInfoAddRequestModel { MarkTransIds = "1232" } };
        //     var transInfoModels = new List<string> { { "123" } };
        //     var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(GetTicketSiteDbModel) };
        //     IEnumerable<object>[] fakeData = { validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = 0,
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     var sessionService = Substitute.For<ISessionService>();
        //     sessionService.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();
        //     var service = new LogInfoServiceImp(repository, sessionService, transInfoService);

        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.Equal(1, actual.GetLogInfoModels.Count());
        // }

        // [Fact]
        // public async Task GetLogInfo_IsWrongHDP_ReturnResult()
        // {
        //     // Arrange
        //     const int matchId = 996063;
        //     var wrongHdpModels = new List<WrongHdpViewModel>
        //     {
        //         new WrongHdpViewModel { MatchId = matchId }
        //     };
        //     var validations = new List<Validation> { new Validation { MatchId = matchId } };
        //     var ticketRequests = new List<TicketRequest> { new TicketRequest { MatchId = matchId, RequestId = 3333 } };
        //     var logInfo = new List<LogInfoDetail> { new LogInfoDetail { MatchId = matchId } };
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel> { new TransInfoAddRequestModel { MarkTransIds = "1232" } };
        //     var transInfoModels = new List<string> { { "123" } };
        //     var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(GetTicketSiteDbModel) };
        //     IEnumerable<object>[] fakeData = { validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels };
        //     var getLogInfoModel = new GetLogInfoModel
        //     {
        //         LogInfoDetail = logInfo[0],
        //         Validation = validations[0],
        //         TicketRequest = ticketRequests
        //     };
        //     var expected = new GetLogInfoViewModel
        //     {
        //         GetLogInfoModels = new List<GetLogInfoModel> { getLogInfoModel },
        //         TransInfoAddRequestModel = new TransInfoAddRequestModel()
        //     };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = IssueTypeConstant.WrongHDP,
        //         MatchId = matchId,
        //         SubIssueTypeId = 10,
        //         WrongHdpModels = wrongHdpModels
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     const int userId = 1234;
        //     var sessionService = Substitute.For<ISessionService>();
        //     sessionService.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();
        //     var service = new LogInfoServiceImp(repository, sessionService, transInfoService);

        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.Equal(expected.GetLogInfoModels[0].LogInfoDetail,
        //         actual.GetLogInfoModels[0].LogInfoDetail);
        //     Assert.Equal(expected.GetLogInfoModels[0].Validation, actual.GetLogInfoModels[0].Validation);
        //     Assert.Equal(expected.GetLogInfoModels[0].TicketRequest,
        //         actual.GetLogInfoModels[0].TicketRequest);
        // }

        // [Fact]
        // public async Task GetLogInfo_IsWrong1stHDP_ReturnResult()
        // {
        //     // Arrange
        //     const int matchId = 996063;
        //     var wrongHdpModels = new List<WrongHdpViewModel>
        //     {
        //         new WrongHdpViewModel { MatchId = matchId }
        //     };
        //     var validations = new List<Validation> { new Validation { MatchId = matchId } };
        //     var ticketRequests = new List<TicketRequest> { new TicketRequest { MatchId = matchId, RequestId = 3333 } };
        //     var logInfo = new List<LogInfoDetail> { new LogInfoDetail { MatchId = matchId } };
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel> { new TransInfoAddRequestModel { MarkTransIds = "1232" } };
        //     var transInfoModels = new List<string> { { "123" } };
        //     var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(GetTicketSiteDbModel) };
        //     IEnumerable<object>[] fakeData = { validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels };
        //     var getLogInfoModel = new GetLogInfoModel
        //     {
        //         LogInfoDetail = logInfo[0],
        //         Validation = validations[0],
        //         TicketRequest = ticketRequests
        //     };
        //     var expected = new GetLogInfoViewModel
        //     {
        //         GetLogInfoModels = new List<GetLogInfoModel> { getLogInfoModel },
        //         TransInfoAddRequestModel = new TransInfoAddRequestModel()
        //     };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = IssueTypeConstant.Wrong1stHDP,
        //         MatchId = matchId,
        //         SubIssueTypeId = 10,
        //         Wrong1stHdpModels = wrongHdpModels
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     const int userId = 1234;
        //     var sessionService = Substitute.For<ISessionService>();
        //     sessionService.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();
        //     var service = new LogInfoServiceImp(repository, sessionService, transInfoService);

        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.Equal(expected.GetLogInfoModels[0].LogInfoDetail,
        //         actual.GetLogInfoModels[0].LogInfoDetail);
        //     Assert.Equal(expected.GetLogInfoModels[0].Validation, actual.GetLogInfoModels[0].Validation);
        //     Assert.Equal(expected.GetLogInfoModels[0].TicketRequest,
        //         actual.GetLogInfoModels[0].TicketRequest);
        // }

        // [Fact]
        // public async Task GetLogInfo_IsWrongOU_ReturnResult()
        // {
        //     // Arrange
        //     const int matchId = 996063;
        //     var wrongOuModels = new List<WrongOuViewModel>
        //     {
        //         new WrongOuViewModel { MatchId = matchId }
        //     };
        //     var validations = new List<Validation> { new Validation { MatchId = matchId } };
        //     var ticketRequests = new List<TicketRequest> { new TicketRequest { MatchId = matchId, RequestId = 3333 } };
        //     var logInfo = new List<LogInfoDetail> { new LogInfoDetail { MatchId = matchId } };
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel> { new TransInfoAddRequestModel { MarkTransIds = "1232" } };
        //     var transInfoModels = new List<string> { { "123" } };
        //     var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(GetTicketSiteDbModel) };
        //     IEnumerable<object>[] fakeData = { validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels };
        //     var getLogInfoModel = new GetLogInfoModel
        //     {
        //         LogInfoDetail = logInfo[0],
        //         Validation = validations[0],
        //         TicketRequest = ticketRequests
        //     };
        //     var expected = new GetLogInfoViewModel
        //     {
        //         GetLogInfoModels = new List<GetLogInfoModel> { getLogInfoModel },
        //         TransInfoAddRequestModel = new TransInfoAddRequestModel()
        //     };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = IssueTypeConstant.WrongOU,
        //         MatchId = matchId,
        //         SubIssueTypeId = 10,
        //         WrongOuModels = wrongOuModels
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     const int userId = 1234;
        //     var sessionService = Substitute.For<ISessionService>();
        //     sessionService.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();
        //     var service = new LogInfoServiceImp(repository, sessionService, transInfoService);

        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.Equal(expected.GetLogInfoModels[0].LogInfoDetail,
        //         actual.GetLogInfoModels[0].LogInfoDetail);
        //     Assert.Equal(expected.GetLogInfoModels[0].Validation, actual.GetLogInfoModels[0].Validation);
        //     Assert.Equal(expected.GetLogInfoModels[0].TicketRequest,
        //         actual.GetLogInfoModels[0].TicketRequest);
        // }

        // [Fact]
        // public async Task GetLogInfo_IsWrong1stOU_ReturnResult()
        // {
        //     // Arrange
        //     const int matchId = 996063;
        //     var wrongOuModels = new List<WrongOuViewModel>
        //     {
        //         new WrongOuViewModel { MatchId = matchId }
        //     };
        //     var validations = new List<Validation> { new Validation { MatchId = matchId } };
        //     var ticketRequests = new List<TicketRequest> { new TicketRequest { MatchId = matchId, RequestId = 3333 } };
        //     var logInfo = new List<LogInfoDetail> { new LogInfoDetail { MatchId = matchId } };
        //     var transInfoAddRequestModels = new List<TransInfoAddRequestModel> { new TransInfoAddRequestModel { MarkTransIds = "1232" } };
        //     var transInfoModels = new List<string> { { "123" } };
        //     var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(GetTicketSiteDbModel) };
        //     IEnumerable<object>[] fakeData = { validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels };
        //     var getLogInfoModel = new GetLogInfoModel
        //     {
        //         LogInfoDetail = logInfo[0],
        //         Validation = validations[0],
        //         TicketRequest = ticketRequests
        //     };
        //     var expected = new GetLogInfoViewModel
        //     {
        //         GetLogInfoModels = new List<GetLogInfoModel> { getLogInfoModel },
        //         TransInfoAddRequestModel = new TransInfoAddRequestModel()
        //     };
        //     var request = new GetLogInfoRequest
        //     {
        //         IssueTypeId = IssueTypeConstant.Wrong1stOU,
        //         MatchId = matchId,
        //         SubIssueTypeId = 10,
        //         Wrong1stOuModels = wrongOuModels
        //     };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     repository
        //         .FetchMultipleAsync(Arg.Compat.Any<GetLogInfoCriteria>(), mappingTypes)
        //         .ReturnsForAnyArgs(fakeData);
        //     const int userId = 1234;
        //     var sessionService = Substitute.For<ISessionService>();
        //     sessionService.UserId.ReturnsForAnyArgs(userId);
        //     var transInfoService = Substitute.For<GetTransInfoService>();
        //     var service = new LogInfoServiceImp(repository, sessionService, transInfoService);
        //     // Act
        //     var actual = await service.GetLogInfo(request);

        //     // Assert
        //     Assert.Equal(expected.GetLogInfoModels[0].LogInfoDetail,
        //         actual.GetLogInfoModels[0].LogInfoDetail);
        //     Assert.Equal(expected.GetLogInfoModels[0].Validation, actual.GetLogInfoModels[0].Validation);
        //     Assert.Equal(expected.GetLogInfoModels[0].TicketRequest,
        //         actual.GetLogInfoModels[0].TicketRequest);
        // }
    }
}