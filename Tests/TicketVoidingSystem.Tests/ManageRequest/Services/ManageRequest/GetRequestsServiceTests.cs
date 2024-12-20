using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

public class GetRequestsServiceTests
{
    private readonly GetRequestsInActiveTableService getRequestsInActiveTableService;
    private readonly GetRequestsInArchivedTableService getRequestsInArchivedTableService;
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly GetRequestsServiceImp service;

    public GetRequestsServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        repository = Substitute.For<IDynamicRepository>();
        getRequestsInActiveTableService = Substitute.For<GetRequestsInActiveTableService>();
        getRequestsInArchivedTableService = Substitute.For<GetRequestsInArchivedTableService>();

        service = new GetRequestsServiceImp(mapper, repository, getRequestsInActiveTableService,
            getRequestsInArchivedTableService);
    }

    [Fact]
    public async Task GetData_WhenRequestIdValid_HasCallGetRequestsInActiveTable()
    {
        // Arrange
        var requestModel = new List<RequestModel>();
        var query = new SelectRequestsQuery { RequestId = "123" };
        getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs((requestModel, new List<string>()));

        // Act
        _ = await service.GetRequests(query);

        // Assert
        await getRequestsInActiveTableService.Received().GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>());
    }

    [Fact]
    public async Task GetData_WhenMatchIdValid_HasCallGetRequestsInActiveTable()
    {
        // Arrange
        var requestModel = new List<RequestModel>();
        var query = new SelectRequestsQuery { RequestId = null, MatchId = "1" };
        getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs((requestModel, new List<string>()));

        // Act
        _ = await service.GetRequests(query);

        // Assert
        await getRequestsInActiveTableService.Received().GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>());
    }

    [Fact]
    public async Task GetData_WhenIsFromDateBeforeBUDayFalse_HasCallGetRequestsInActiveTable()
    {
        // Arrange
        var requestModel = new List<RequestModel>();
        var query = new SelectRequestsQuery { RequestId = null, IsFromDateBeforeBUDay = false };
        getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs((requestModel, new List<string>()));
        mapper.Map<GetActiveRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>())
            .Returns(new GetActiveRequestInfoCriteria());
        // Act
        var actual = await service.GetRequests(query);

        // Assert
        await getRequestsInActiveTableService.Received().GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>());
        Assert.NotNull(actual.Item1);
        Assert.NotNull(actual.Item2);
    }

    [Fact]
    public async Task GetData_WhenIsToDateBeforeBUDayTrue_ReturnEmpty()
    {
        // Arrange
        var requestModel = new List<RequestModel>();
        var _ = new List<string>();
        var query = new SelectRequestsQuery
        { RequestId = null, IsFromDateBeforeBUDay = true, IsToDateBeforeBUDay = true };
        getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs((requestModel, _));
        mapper.Map<GetArchivedRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>())
            .Returns(new GetArchivedRequestInfoCriteria());
        repository.FetchMultipleAsync<string, string>(Arg.Any<GetArchivedRequestInfoCriteria>())
            .ReturnsForAnyArgs((new List<string>(), new List<string>()));
        // Act
        var actual = await service.GetRequests(query);

        // Assert
        Assert.Empty(actual.Item1);
    }

    [Fact]
    public async Task GetData_WhenIsToDateBeforeBUDayTrue_ReturnListRequestModel()
    {
        // Arrange
        var requestModel = new List<RequestModel>
        {
            new()
            {
                RequestId = 1
            },
            new()
            {
                RequestId = 2
            }
        };
        var requestArchivedModel = new List<RequestModel>
        {
            new()
            {
                RequestId = 1
            },
            new()
            {
                RequestId = 2
            }
        };
        var _ = new List<string>();
        var query = new SelectRequestsQuery
        { RequestId = null, IsFromDateBeforeBUDay = true, IsToDateBeforeBUDay = true };

        getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs((requestModel, _));
        getRequestsInArchivedTableService.GetRequestsInArchivedTable(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs((requestArchivedModel, _));
        mapper.Map<GetArchivedRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>())
            .Returns(new GetArchivedRequestInfoCriteria());
        repository.GetAsync<string>(Arg.Any<GetArchivedRequestInfoCriteria>())
            .Returns("aaa");

        // Act
        var actual = await service.GetRequests(query);

        // Assert
        Assert.Equal(2, actual.Item1.Count());
    }

    [Fact]
    public async Task GetData_WhenIsAnotherInput_ReturnListRequestModel()
    {
        // Arrange
        var requestModel = new List<RequestModel>
        {
            new()
            {
                RequestId = 1
            }
        };
        var requestArchivedModel = new List<RequestModel>
        {
            new()
            {
                RequestId = 1
            }
        };
        var _ = new List<string>();
        var query = new SelectRequestsQuery
        { RequestId = null, IsFromDateBeforeBUDay = true, IsToDateBeforeBUDay = false };

        getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs((requestModel, _));
        getRequestsInArchivedTableService.GetRequestsInArchivedTable(Arg.Any<SelectRequestsQuery>())
            .ReturnsForAnyArgs((requestArchivedModel, _));

        mapper.Map<GetArchivedRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>())
            .Returns(new GetArchivedRequestInfoCriteria());
        mapper.Map<GetActiveRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>())
            .Returns(new GetActiveRequestInfoCriteria());
        repository.FetchMultipleAsync<string, string>(Arg.Any<GetArchivedRequestInfoCriteria>())
            .Returns((new List<string>(), new List<string>()));
        repository.FetchAsync<string>(Arg.Any<GetActiveRequestInfoCriteria>())
            .Returns(new List<string>());

        // Act
        var actual = await service.GetRequests(query);

        // Assert
        Assert.Single(actual.Item1);
    }
}