using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

public class GetRequestsInActiveTableServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    private readonly BetListService betListService = Substitute.For<BetListService>();
    private readonly IMapper mapper = Substitute.For<IMapper>();
    private readonly IDynamicRepository repository = Substitute.For<IDynamicRepository>();
    private readonly OnlineServerRepository onlineServerRepository = Substitute.For<OnlineServerRepository>();
    private readonly GetRequestsInActiveTableServiceImp service;

    public GetRequestsInActiveTableServiceTests()
    {
        service = new GetRequestsInActiveTableServiceImp(repository, onlineServerRepository, mapper, betListService);
    }

    [Theory]
    [InlineData(IssueTypeConstant.DangerAccepted, 2, 1)]
    [InlineData(IssueTypeConstant.EarlyKickOffTime, 1, 1)]
    [InlineData(IssueTypeConstant.WrongKickOffTime, 2, 2)]
    [InlineData(IssueTypeConstant.AbnormalBet, 2, 1)]
    [InlineData(IssueTypeConstant.WrongHDP, 2, 1)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, 1, 1)]
    [InlineData(IssueTypeConstant.WrongOU, 2, 2)]
    [InlineData(IssueTypeConstant.Wrong1stOU, 2, 1)]
    [InlineData(IssueTypeConstant.RedCard, 2, 1)]
    [InlineData(0, 2, 1)]
    public async Task GetRequestsInActiveTable_ValidData_ReturnListRequestModel(int issueTypeId, int requestId, int matchId)
    {
        // Arrange
        var query = new SelectRequestsQuery();
        var criteriaActive = new SelectActiveRequestsCriteria();
        var requests = new[] { new RequestModel { IssueTypeId = issueTypeId, FilterBy = null, RequestId = 2, MatchId = 1, TotalSingleProcessed = 1 } };
        var requestInfoJson = new[] { "" };
        var requestInfoGetCalcTime = new[] { "" };
        var betTypeForRequests = new[] { new GetBettypeForRequestModel() };
        mapper.Map<SelectActiveRequestsCriteria>(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs(criteriaActive);
        repository.FetchMultipleAsync<RequestModel, string, string, GetBettypeForRequestModel>(Arg.Any<SelectActiveRequestsCriteria>())
            .ReturnsForAnyArgs((requests, requestInfoJson, requestInfoGetCalcTime, betTypeForRequests));
        repository.FetchAsync<GetRequestInfoModel>(Arg.Any<GetTotalVoidedTicketCriteria>())
            .Returns(new List<GetRequestInfoModel> { new() { RequestId = requestId, MatchId = matchId } });
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("aa");

        // Act
        var actual = await service.GetRequestsInActiveTable(query);

        // Assert
        Assert.NotNull(actual.Item1);
    }
}