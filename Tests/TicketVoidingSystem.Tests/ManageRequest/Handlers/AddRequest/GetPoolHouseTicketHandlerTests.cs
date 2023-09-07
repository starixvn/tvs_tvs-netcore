using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetPoolHouseTicketHandlerTests
{
    private readonly GetPoolHouseTicketService getPoolHouseTicketService;
    private readonly GetTransInfoService getTransInfoService;
    private readonly GetPoolHouseTicketHandler handler;
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;

    public GetPoolHouseTicketHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        getPoolHouseTicketService = Substitute.For<GetPoolHouseTicketService>();
        mapper = Substitute.For<IMapper>();
        handler = new GetPoolHouseTicketHandler(repository, getPoolHouseTicketService, getTransInfoService, mapper);
    }

    [Theory]
    [InlineData(4, true, false, 1, true)]
    [InlineData(6, false, false, 1, false)]
    [InlineData(6, true, false, 1, true)]
    [InlineData(2, false, false, 1, true)]
    [InlineData(5, false, false, 1, false)]
    [InlineData(5, false, true, 1, true)]
    [InlineData(7, false, true, 1, true)]
    [InlineData(2, true, false, 6, true)]
    [InlineData(2, true, false, 120, true)]
    [InlineData(2, false, true, 9, true)]
    [InlineData(2, false, false, 121, false)]
    public async Task Handler_Successful_ReturnModelExpected(int issueTypeId, bool isAffectedGroup1X2,
        bool isAffectedGroup1H1X2, int subIssueTypeId,
        bool isLinkGroup1X2)
    {
        // Arrange
        var wrongOddsInfo = new List<WrongOddsViewModel> { new() };
        var request = new GetPoolHouseTicketRequest
        {
            IssueTypeId = issueTypeId, SubIssueTypeId = subIssueTypeId, IsLinkGroup1X2 = isLinkGroup1X2,
            IsLinkGroupAIO = true, WrongOddsInfo = wrongOddsInfo
        };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>())
            .ReturnsForAnyArgs(new List<string> { "123", "" });
        var betTypes = new List<BetTypeModel> { new() { GroupName = "1" }, new() { GroupName = "2" } };
        var tickets = new List<GetTicketModel> { new() { GroupName = "1" }, new() { GroupName = "2" } };
        var ticketsViewModel = new TicketsViewModel();
        repository.FetchMultipleAsync<BetTypeModel, GetTicketModel>(Arg.Any<GetPoolHouseTicketCriteria>(),
                CancellationToken.None)
            .ReturnsForAnyArgs((betTypes, tickets));
        getPoolHouseTicketService
            .GetTicketsViewModel(Arg.Any<IEnumerable<GetTicketModel>>(), Arg.Any<GetPoolHouseTicketRequest>())
            .ReturnsForAnyArgs(ticketsViewModel);
        mapper.Map<GetPoolHouseTicketCriteria>(Arg.Any<GetPoolHouseTicketQuery>())
            .ReturnsForAnyArgs(new GetPoolHouseTicketCriteria());
        var viewModel = new GetPoolHouseTicketViewModel
        {
            GroupBetTypes = new List<GroupBetTypeModel>
            {
                new() { GroupName = "1", BetTypes = new List<BetTypeModel> { new() { GroupName = "1" } } },
                new() { GroupName = "2", BetTypes = new List<BetTypeModel> { new() { GroupName = "2" } } }
            },
            Tickets = ticketsViewModel,
            IsAffectedGroup1X2 = isAffectedGroup1X2,
            IsAffectedGroup1H1X2 = isAffectedGroup1H1X2,
            IsAffectedGroupAIO = true
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }

    [Fact]
    public async Task Handler_QueryNoHasWrongOddsInfo_ReturnModelExpected()
    {
        // Arrange
        var request = new GetPoolHouseTicketRequest
            { IssueTypeId = 4, SubIssueTypeId = 1, IsLinkGroup1X2 = true, IsLinkGroupAIO = true, WrongOddsInfo = null };
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>())
            .ReturnsForAnyArgs(new List<string> { "123", "" });
        var betTypes = new List<BetTypeModel> { new() { GroupName = "1" }, new() { GroupName = "2" } };
        var tickets = new List<GetTicketModel> { new() { GroupName = "1" }, new() { GroupName = "2" } };
        var ticketsViewModel = new TicketsViewModel();
        repository.FetchMultipleAsync<BetTypeModel, GetTicketModel>(Arg.Any<GetPoolHouseTicketCriteria>(),
                CancellationToken.None)
            .ReturnsForAnyArgs((betTypes, tickets));
        getPoolHouseTicketService
            .GetTicketsViewModel(Arg.Any<IEnumerable<GetTicketModel>>(), Arg.Any<GetPoolHouseTicketRequest>())
            .ReturnsForAnyArgs(ticketsViewModel);
        mapper.Map<GetPoolHouseTicketCriteria>(Arg.Any<GetPoolHouseTicketQuery>())
            .ReturnsForAnyArgs(new GetPoolHouseTicketCriteria());
        var viewModel = new GetPoolHouseTicketViewModel
        {
            GroupBetTypes = new List<GroupBetTypeModel>
            {
                new() { GroupName = "1", BetTypes = new List<BetTypeModel> { new() { GroupName = "1" } } },
                new() { GroupName = "2", BetTypes = new List<BetTypeModel> { new() { GroupName = "2" } } }
            },
            Tickets = ticketsViewModel,
            IsAffectedGroup1X2 = true,
            IsAffectedGroup1H1X2 = false,
            IsAffectedGroupAIO = true
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }
}