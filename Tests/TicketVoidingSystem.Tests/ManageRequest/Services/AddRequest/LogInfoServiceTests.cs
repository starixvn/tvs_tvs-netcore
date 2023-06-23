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
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest
{
    public class LogInfoServiceTests : IClassFixture<AppSettingFixture>
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

        [Theory]
        [InlineData(IssueTypeConstant.WrongScore)]
        [InlineData(IssueTypeConstant.DangerAccepted)]
        [InlineData(IssueTypeConstant.RedCard)]
        [InlineData(IssueTypeConstant.WrongHDP)]
        [InlineData(IssueTypeConstant.Wrong1stHDP)]
        [InlineData(IssueTypeConstant.WrongOU)]
        [InlineData(IssueTypeConstant.Wrong1stOU)]
        [InlineData(IssueTypeConstant.WrongOdds)]
        [InlineData(0)]
        public async Task GetLogInfo_HasCall_ReturnResult(int issueTypeId)
        {
            // Arrange
            const int userId = 1234;
            const int scoreId = 62122;
            const int matchId = 996063;
            var validations = new List<Validation> { new Validation { ScoreId = scoreId } };
            var ticketRequests = new List<TicketRequest> { new TicketRequest { ScoreId = scoreId, RequestId = 3333 } };
            var logInfo = new List<LogInfoDetail> { new LogInfoDetail { ScoreId = scoreId } };
            var transInfoAddRequestModels = new List<TransInfoAddRequestModel>
                 {new TransInfoAddRequestModel {MarkTransIds = "1232"}};
            var transInfoModels = new List<string> { { "123" } };
            var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(string) };

            IEnumerable<object>[] fakeData =
                {validations, ticketRequests, logInfo, transInfoAddRequestModels, transInfoModels};
            var getLogInfoModel = new GetLogInfoModel
            {
                LogInfoDetail = logInfo[0],
                Validation = validations[0],
                TicketRequest = ticketRequests
            };
            var expected = new GetLogInfoViewModel
            {
                GetLogInfoModels = new List<GetLogInfoModel> { getLogInfoModel },
                TransInfoAddRequestModel = new TransInfoAddRequestModel()
            };
            var wrongScoreInfoViewModel = new WrongScoreInfoViewModel
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
                WrongScoreModels = new List<WrongScoreInfoViewModel> { wrongScoreInfoViewModel },
                RedCardModels = new List<DangerAcceptedViewModel>(),
                DangerAcceptedModels = new List<DangerAcceptedViewModel>(),
                WrongHdpModels = new List<WrongHdpViewModel>(),
                Wrong1stHdpModels = new List<WrongHdpViewModel>(),
                WrongOuModels = new List<WrongOuViewModel>(),
                Wrong1stOuModels = new List<WrongOuViewModel>(),
                WrongOddsModels = new List<WrongOddsViewModel>(),
                MatchId = matchId,
                KickOffTime = DateTime.Now,

            };
            repository.FetchMultipleAsync(Arg.Any<GetLogInfoCriteria>(), mappingTypes).ReturnsForAnyArgs(fakeData);
            session.UserId.ReturnsForAnyArgs(userId);
            mapper.Map<GetLogInfoCriteria>(Arg.Any<GetLogInfoQuery>()).ReturnsForAnyArgs(new GetLogInfoCriteria());
            var transInfoJson = new List<string> { issueTypeId.ToString() };
            getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>()).ReturnsForAnyArgs(transInfoJson);
            var transInfoService = Substitute.For<GetTransInfoService>();

            // Act
            var actual = await service.GetLogInfo(request);

            // Assert
            Assert.NotNull(actual);
        }
    }
}