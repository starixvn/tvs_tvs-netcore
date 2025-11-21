using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark;

public class GetRemarksServiceTests
{
    private readonly GetRemarksInActiveTableService getRemarksInActiveTableService;
    private readonly GetRemarksInArchivedTableService getRemarksInArchivedTableService;
    private readonly GetRemarksServiceImp service;

    public GetRemarksServiceTests()
    {
        getRemarksInActiveTableService = Substitute.For<GetRemarksInActiveTableService>();
        getRemarksInArchivedTableService = Substitute.For<GetRemarksInArchivedTableService>();
        service = new GetRemarksServiceImp(getRemarksInActiveTableService, getRemarksInArchivedTableService);
    }

    [Fact]
    public async Task GetRemarks_WhenRemarkIdValid_HasCallGetRemarksInActiveTable()
    {
        // Arrange
        var remarks = new List<RemarkModel>();
        var query = new SelectRemarksQuery { RemarkId = 1 };
        getRemarksInActiveTableService.GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);

        // Act
        _ = await service.GetRemarks(query);

        // Assert
        await getRemarksInActiveTableService.Received().GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>());
        Assert.Null(query.FromDate);
        Assert.Null(query.ToDate);
    }

    [Fact]
    public async Task GetRemarks_WhenMatchIdValid_HasCallGetRemarksInActiveTable()
    {
        // Arrange
        var remarks = new List<RemarkModel>();
        var query = new SelectRemarksQuery { MatchId = 1 };
        getRemarksInActiveTableService.GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);

        // Act
        _ = await service.GetRemarks(query);

        // Assert
        await getRemarksInActiveTableService.Received().GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>());
        Assert.Null(query.FromDate);
        Assert.Null(query.ToDate);
    }

    [Fact]
    public async Task GetRemarks_WhenIsFromDateBeforeBUDayFalse_HasCallGetRemarksInActiveTable()
    {
        // Arrange
        var remarks = new List<RemarkModel> { new() { RemarkId = 1 } };
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            MatchId = null,
            IsFromDateBeforeBUDay = false
        };
        getRemarksInActiveTableService.GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);

        // Act
        var actual = await service.GetRemarks(query);

        // Assert
        await getRemarksInActiveTableService.Received().GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>());
        Assert.NotNull(actual);
        Assert.Single(actual);
    }

    [Fact]
    public async Task GetRemarks_WhenIsToDateBeforeBUDayTrue_HasCallGetRemarksInArchivedTable()
    {
        // Arrange
        var remarks = new List<RemarkModel> { new() { RemarkId = 1 } };
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            MatchId = null,
            IsFromDateBeforeBUDay = true,
            IsToDateBeforeBUDay = true
        };
        getRemarksInArchivedTableService.GetRemarksInArchivedTable(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);

        // Act
        var actual = await service.GetRemarks(query);

        // Assert
        await getRemarksInArchivedTableService.Received().GetRemarksInArchivedTable(Arg.Any<SelectRemarksQuery>());
        Assert.NotNull(actual);
        Assert.Single(actual);
    }

    [Fact]
    public async Task GetRemarks_WhenIsFromDateBeforeBUDayTrueAndIsToDateBeforeBUDayFalse_ReturnUnionOfBoth()
    {
        // Arrange
        var activeRemarks = new List<RemarkModel> { new() { RemarkId = 1 } };
        var archivedRemarks = new List<RemarkModel> { new() { RemarkId = 2 } };
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            MatchId = null,
            IsFromDateBeforeBUDay = true,
            IsToDateBeforeBUDay = false,
            BUDay = System.DateTime.Now
        };
        getRemarksInActiveTableService.GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(activeRemarks);
        getRemarksInArchivedTableService.GetRemarksInArchivedTable(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(archivedRemarks);

        // Act
        var actual = await service.GetRemarks(query);

        // Assert
        await getRemarksInActiveTableService.Received().GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>());
        await getRemarksInArchivedTableService.Received().GetRemarksInArchivedTable(Arg.Any<SelectRemarksQuery>());
        Assert.Equal(2, actual.Count());
    }

    [Fact]
    public async Task GetRemarks_WhenIsFromDateBeforeBUDayTrue_SetFromDateToBUDay()
    {
        // Arrange
        var remarks = new List<RemarkModel>();
        var buday = System.DateTime.Now;
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            MatchId = null,
            IsFromDateBeforeBUDay = true,
            IsToDateBeforeBUDay = false,
            BUDay = buday
        };
        getRemarksInActiveTableService.GetRemarksInActiveTable(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);

        // Act
        _ = await service.GetRemarks(query);

        // Assert
        Assert.Equal(buday, query.FromDate);
    }

    [Fact]
    public async Task GetRemarks_WhenIsToDateBeforeBUDayFalse_SetToDateToBUDay()
    {
        // Arrange
        var remarks = new List<RemarkModel>();
        var buday = System.DateTime.Now;
        var query = new SelectRemarksQuery
        {
            RemarkId = null,
            MatchId = null,
            IsFromDateBeforeBUDay = true,
            IsToDateBeforeBUDay = false,
            BUDay = buday
        };
        getRemarksInArchivedTableService.GetRemarksInArchivedTable(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);

        // Act
        _ = await service.GetRemarks(query);

        // Assert
        Assert.Equal(buday, query.ToDate);
    }
}