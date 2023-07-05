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

public class GetRequestsInArchivedTableServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly BetListService betListService;
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly GetRequestsInArchivedTableServiceImp service;

    public GetRequestsInArchivedTableServiceTests()
    {
        betListService = Substitute.For<BetListService>();
        repository = Substitute.For<IDynamicRepository>();
        mapper = Substitute.For<IMapper>();
        service = new GetRequestsInArchivedTableServiceImp(mapper, repository, betListService);
    }

    [Theory]
    [InlineData(IssueTypeConstant.DangerAccepted)]
    [InlineData(IssueTypeConstant.AbnormalBetRealMember)]
    [InlineData(IssueTypeConstant.AbnormalBet)]
    [InlineData(0)]
    public async Task GetRequestsInArchivedTable_ValidData_ReturnListRequestModel(int issueTypeId)
    {
        // Arrange
        var query = new SelectRequestsQuery();
        mapper.Map<SelectArchivedRequestsCriteria>(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs(new SelectArchivedRequestsCriteria());
        var model = new List<RequestModel>
            { new() { IssueTypeId = issueTypeId, RequestId = 1, TransIds = "1", FilterBy = null } };
        var requestInfoGetCalcTime = new List<string> { "" };
        repository.FetchMultipleAsync<RequestModel, string>(Arg.Any<SelectArchivedRequestsCriteria>())
            .ReturnsForAnyArgs((model, requestInfoGetCalcTime));
        repository.Fetch<GetBettypeForRequestModel>(Arg.Any<GetBettypeNamesArchiveCriteria>())
            .ReturnsForAnyArgs(new List<GetBettypeForRequestModel> { new() { RequestId = 1 } });
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("aa");

        // Act
        var actual = await service.GetRequestsInArchivedTable(query);

        // Assert
        Assert.NotNull(actual.Item1);
    }
}