using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark;

public class GetRemarksInArchivedTableServiceTests
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly GetRemarksInArchivedTableServiceImp service;

    public GetRemarksInArchivedTableServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        repository = Substitute.For<IDynamicRepository>();
        service = new GetRemarksInArchivedTableServiceImp(mapper, repository);
    }

    [Fact]
    public async Task GetRemarksInArchivedTable_ValidData_ReturnListRemarkModel()
    {
        // Arrange
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            FromDate = DateTime.Now.AddDays(-7),
            ToDate = DateTime.Now
        };
        var criteriaArchived = new SelectArchivedRemarksCriteria();
        var remarks = new List<RemarkModel> { new() { RemarkId = 1, MatchId = 1 } };
        mapper.Map<SelectArchivedRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaArchived);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectArchivedRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        var actual = await service.GetRemarksInArchivedTable(query);

        // Assert
        Assert.NotNull(actual);
        Assert.Single(actual);
        await repository.Received().FetchAsync<RemarkModel>(Arg.Any<SelectArchivedRemarksCriteria>());
    }

    [Fact]
    public async Task GetRemarksInArchivedTable_WhenIsToDateBeforeBUDayFalse_SetCriteriaToDateToBUDay()
    {
        // Arrange
        var buday = DateTime.Now;
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            IsToDateBeforeBUDay = false,
            BUDay = buday
        };
        var criteriaArchived = new SelectArchivedRemarksCriteria();
        var remarks = new List<RemarkModel>();
        mapper.Map<SelectArchivedRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaArchived);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectArchivedRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        _ = await service.GetRemarksInArchivedTable(query);

        // Assert
        await repository.Received().FetchAsync<RemarkModel>(Arg.Is<SelectArchivedRemarksCriteria>(c => c.ToDate == buday));
    }

    [Fact]
    public async Task GetRemarksInArchivedTable_EmptyResult_ReturnEmptyList()
    {
        // Arrange
        var query = new SelectRemarksQuery { MatchId = 1 };
        var criteriaArchived = new SelectArchivedRemarksCriteria();
        var remarks = new List<RemarkModel>();
        mapper.Map<SelectArchivedRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaArchived);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectArchivedRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        var actual = await service.GetRemarksInArchivedTable(query);

        // Assert
        Assert.NotNull(actual);
        Assert.Empty(actual);
    }

    [Fact]
    public async Task GetRemarksInArchivedTable_FromDateIsSet_SetCriteriaFromDateCorrectly()
    {
        // Arrange
        var fromDate = DateTime.Now.AddDays(-7);
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            FromDate = fromDate,
            ToDate = DateTime.Now
        };
        var criteriaArchived = new SelectArchivedRemarksCriteria();
        var remarks = new List<RemarkModel>();
        mapper.Map<SelectArchivedRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaArchived);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectArchivedRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        _ = await service.GetRemarksInArchivedTable(query);

        // Assert
        await repository.Received().FetchAsync<RemarkModel>(Arg.Is<SelectArchivedRemarksCriteria>(c => c.FromDate == fromDate));
    }

    [Fact]
    public async Task GetRemarksInArchivedTable_WhenIsToDateBeforeBUDayTrue_ToDateNotSetToBUDay()
    {
        // Arrange
        var buday = DateTime.Now;
        var toDate = DateTime.Now.AddDays(-1);
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            IsToDateBeforeBUDay = true,
            BUDay = buday,
            ToDate = toDate
        };
        var criteriaArchived = new SelectArchivedRemarksCriteria();
        var remarks = new List<RemarkModel>();
        mapper.Map<SelectArchivedRemarksCriteria>(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(criteriaArchived);
        repository.FetchAsync<RemarkModel>(Arg.Any<SelectArchivedRemarksCriteria>())
            .ReturnsForAnyArgs(remarks);

        // Act
        _ = await service.GetRemarksInArchivedTable(query);

        // Assert
        await repository.Received().FetchAsync<RemarkModel>(Arg.Is<SelectArchivedRemarksCriteria>(c => c.ToDate != buday));
    }
}