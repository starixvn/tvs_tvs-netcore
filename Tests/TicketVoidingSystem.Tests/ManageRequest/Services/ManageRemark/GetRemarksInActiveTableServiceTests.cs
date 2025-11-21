using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark;

public class GetRemarksInActiveTableServiceTests
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly GetRemarksInActiveTableServiceImp service;

    public GetRemarksInActiveTableServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        repository = Substitute.For<IDynamicRepository>();
        service = new GetRemarksInActiveTableServiceImp(mapper, repository);
    }

    [Fact]
    public async Task GetRemarksInActiveTable_ValidData_ReturnListRemarkModel()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var criteriaActive = new SelectActiveRemarksCriteria();
        var remarks = new List<RemarkModel> { new() { RemarkId = 1, MatchId = 1 } };
        mapper.Map<SelectActiveRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaActive);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectActiveRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        var actual = await service.GetRemarksInActiveTable(query);

        // Assert
        Assert.NotNull(actual);
        Assert.Single(actual);
        await repository.Received().FetchAsync<RemarkModel>(Arg.Any<SelectActiveRemarksCriteria>());
    }

    [Fact]
    public async Task GetRemarksInActiveTable_EmptyResult_ReturnEmptyList()
    {
        // Arrange
        var query = new SelectRemarksQuery { MatchId = 1 };
        var criteriaActive = new SelectActiveRemarksCriteria();
        var remarks = new List<RemarkModel>();
        mapper.Map<SelectActiveRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaActive);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectActiveRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        var actual = await service.GetRemarksInActiveTable(query);

        // Assert
        Assert.NotNull(actual);
        Assert.Empty(actual);
    }

    [Fact]
    public async Task GetRemarksInActiveTable_MapperCalledWithCorrectQuery()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1, MatchId = 2 };
        var criteriaActive = new SelectActiveRemarksCriteria();
        var remarks = new List<RemarkModel>();
        mapper.Map<SelectActiveRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaActive);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectActiveRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        _ = await service.GetRemarksInActiveTable(query);

        // Assert
        mapper.Received().Map<SelectActiveRemarksCriteria>(query);
    }

    [Fact]
    public async Task GetRemarksInActiveTable_MultipleRemarks_ReturnAllRemarks()
    {
        // Arrange
        var query = new SelectRemarksQuery { MatchId = 1 };
        var criteriaActive = new SelectActiveRemarksCriteria();
        var remarks = new List<RemarkModel>
        {
            new() { RemarkId = 1, MatchId = 1 },
            new() { RemarkId = 2, MatchId = 1 },
            new() { RemarkId = 3, MatchId = 1 }
        };
        mapper.Map<SelectActiveRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaActive);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectActiveRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        var actual = await service.GetRemarksInActiveTable(query);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(3, actual.Count());
    }
}