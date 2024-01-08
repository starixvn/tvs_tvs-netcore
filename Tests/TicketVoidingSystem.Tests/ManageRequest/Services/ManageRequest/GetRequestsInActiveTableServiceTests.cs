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
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

public class GetRequestsInActiveTableServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    private readonly BetListService betListService;
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly GetRequestsInActiveTableServiceImp service;

    public GetRequestsInActiveTableServiceTests()
    {
        betListService = Substitute.For<BetListService>();
        repository = Substitute.For<IDynamicRepository>();
        mapper = Substitute.For<IMapper>();
        service = new GetRequestsInActiveTableServiceImp(repository, mapper, betListService);
    }

    [Theory]
    [InlineData(IssueTypeConstant.DangerAccepted, 2, 1)]
    [InlineData(IssueTypeConstant.DangerAccepted, 1, 1)]
    [InlineData(IssueTypeConstant.DangerAccepted, 2, 2)]
    [InlineData(IssueTypeConstant.AbnormalBetRealMember, 2, 1)]
    [InlineData(IssueTypeConstant.AbnormalBet, 2, 1)]
    [InlineData(0, 2, 1)]
    public async Task GetRequestsInActiveTable_ValidData_ReturnListRequestModel(int issueTypeId, int requestId, int matchId)
    {
        // Arrange
        var query = new SelectRequestsQuery();
        var criteriaActive = new SelectActiveRequestsCriteria();
        mapper.Map<SelectActiveRequestsCriteria>(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs(criteriaActive);
        var requests = new List<RequestModel>
            { new() { IssueTypeId = issueTypeId, FilterBy = null, RequestId = 2, MatchId = 1, TotalSingleProcessed = 1 } };
        var requestInfo = new List<GetRequestInfoModel> { new() };
        var requestInfoGetCalcTime = new List<string> { "" };
        repository
            .FetchMultipleAsync<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectActiveRequestsCriteria>())
            .ReturnsForAnyArgs((requests, requestInfo, requestInfoGetCalcTime));
        repository.Fetch<GetRequestInfoModel>(Arg.Any<GetTotalVoidedTicketCriteria>())
            .Returns(new List<GetRequestInfoModel> { new() { RequestId = requestId, MatchId = matchId } });
        repository.Fetch<GetBettypeForRequestModel>(Arg.Any<GetBettypeNamesCriteria>())
            .Returns(new List<GetBettypeForRequestModel> { new() });
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("aa");
        // Act
        var actual = await service.GetRequestsInActiveTable(query);

        // Assert
        Assert.NotNull(actual.Item1);
    }
}