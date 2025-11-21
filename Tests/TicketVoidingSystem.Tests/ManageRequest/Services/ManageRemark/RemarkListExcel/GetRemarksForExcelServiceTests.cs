using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using Xunit;
using RemarkModel = TicketVoidingSystem.ManageRequest.Models.ManageRemark.RemarkModel;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark.RemarkListExcel;

public class GetRemarksForExcelServiceTests
{
    private readonly GetRemarksService getRemarksService;
    private readonly RenderRemarkService renderRemarkService;
    private readonly ConvertRequestsService convertRequestsService;
    private readonly GetRemarksForExcelServiceImp service;

    public GetRemarksForExcelServiceTests()
    {
        getRemarksService = Substitute.For<GetRemarksService>();
        renderRemarkService = Substitute.For<RenderRemarkService>();
        convertRequestsService = Substitute.For<ConvertRequestsService>();
        service = new GetRemarksForExcelServiceImp(getRemarksService, renderRemarkService, convertRequestsService);
    }

    [Fact]
    public async Task GetRemarksExcel_ValidQuery_ReturnsExcelRemarksWithIndex()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var remarks = new List<RemarkModel>
        {
            new()
            {
                RemarkId = 1,
                MatchId = 123,
                CreatedDate = new DateTime(2024, 1, 1, 10, 0, 0),
                SettlementStatus = "2-1",
                ActionId = ActionRemarkConstant.Refund,
                MistakenBy = "User1",
                CreatedBy = "User2",
                PerformedBy = "User3",
                Iptv = "IPTV1",
                Trader = "Trader1",
                Suspender = "LA1",
                Source = "Source1",
                Remark = "Test Remark",
                Message = "Test Message",
                DescriptionInput = "Test Description",
                DecidedBy = "User4",
                Provider = "Provider1",
                CloseCaseBy = "User5",
                EventDate = new DateTime(2024, 1, 1),
                KickOffTime = new DateTime(2024, 1, 1, 10, 0, 0),
                SportTypeName = "Football",
                EventName = "Team A vs Team B",
                LeagueName = "Premier League",
                IsCheckedVar = true
            }
        };
        getRemarksService.GetRemarks(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);
        convertRequestsService.GetVarCheckValue(Arg.Any<bool>())
            .ReturnsForAnyArgs("Yes");

        // Act
        var result = await service.GetRemarksExcel(query);

        // Assert
        Assert.NotNull(result);
        var excelRemarks = result.ToList();
        Assert.Single(excelRemarks);
        Assert.Equal(1, excelRemarks[0].Index);
        await getRemarksService.Received(1).GetRemarks(query);
        renderRemarkService.Received(1).UpdateDescription(remarks);
    }

    [Fact]
    public async Task GetRemarksExcel_EmptyRemarks_ReturnsEmptyList()
    {
        // Arrange
        var query = new SelectRemarksQuery { MatchId = 1 };
        var emptyRemarks = new List<RemarkModel>();
        getRemarksService.GetRemarks(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(emptyRemarks);

        // Act
        var result = await service.GetRemarksExcel(query);

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
        await getRemarksService.Received(1).GetRemarks(query);
        renderRemarkService.Received(1).UpdateDescription(emptyRemarks);
    }

    [Fact]
    public async Task GetRemarksExcel_MultipleRemarks_ReturnsWithSequentialIndex()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var remarks = new List<RemarkModel>
        {
            new() { RemarkId = 1, MatchId = 123, CreatedDate = DateTime.Now, ActionId = ActionRemarkConstant.Refund, IsCheckedVar = false },
            new() { RemarkId = 2, MatchId = 124, CreatedDate = DateTime.Now, ActionId = ActionRemarkConstant.Waiting, IsCheckedVar = true },
            new() { RemarkId = 3, MatchId = 125, CreatedDate = DateTime.Now, ActionId = ActionRemarkConstant.TakeNote, IsCheckedVar = false }
        };
        getRemarksService.GetRemarks(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);
        convertRequestsService.GetVarCheckValue(Arg.Any<bool>())
            .ReturnsForAnyArgs("No");

        // Act
        var result = await service.GetRemarksExcel(query);

        // Assert
        var excelRemarks = result.ToList();
        Assert.Equal(3, excelRemarks.Count());
        Assert.Equal(1, excelRemarks[0].Index);
        Assert.Equal(2, excelRemarks[1].Index);
        Assert.Equal(3, excelRemarks[2].Index);
    }

    [Fact]
    public async Task GetRemarksExcel_ValidRemark_MapsAllFieldsCorrectly()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var remark = new RemarkModel
        {
            RemarkId = 1,
            MatchId = 123,
            CreatedDate = new DateTime(2024, 1, 1, 10, 30, 0),
            SettlementStatus = "2-1",
            ActionId = ActionRemarkConstant.VoidTicket,
            MistakenBy = "User1",
            CreatedBy = "User2",
            PerformedBy = "User3",
            Iptv = "IPTV1",
            Trader = "Trader1",
            Suspender = "LA1",
            Source = "Source1",
            Remark = "Test Remark",
            Message = "Test Message",
            DescriptionInput = "Test Description",
            DecidedBy = "User4",
            Provider = "Provider1",
            CloseCaseBy = "User5",
            EventDate = new DateTime(2024, 1, 1),
            KickOffTime = new DateTime(2024, 1, 1, 10, 0, 0),
            SportTypeName = "Football",
            EventName = "Team A vs Team B",
            LeagueName = "Premier League",
            IsCheckedVar = true
        };
        var remarks = new List<RemarkModel> { remark };
        getRemarksService.GetRemarks(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);
        convertRequestsService.GetVarCheckValue(true).Returns("Yes");

        // Act
        var result = await service.GetRemarksExcel(query);

        // Assert
        var excelRemark = result.First();
        Assert.Equal("123", excelRemark.MatchId);
        Assert.Equal("2-1", excelRemark.CalculatedScore);
        Assert.Equal("Void Ticket", excelRemark.Action);
        Assert.Equal("User1", excelRemark.MistakenBy);
        Assert.Equal("User2", excelRemark.CreatedBy);
        Assert.Equal("User3", excelRemark.PerformedBy);
        Assert.Equal("IPTV1", excelRemark.TVAndIPTV);
        Assert.Equal("Trader1", excelRemark.Trader);
        Assert.Equal("LA1", excelRemark.LA);
        Assert.Equal("Source1", excelRemark.Source);
        Assert.Equal("Test Remark", excelRemark.Remark);
        Assert.Equal("Test Message", excelRemark.Message);
        Assert.Equal("Test Description", excelRemark.Description);
        Assert.Equal("User4", excelRemark.DecidedBy);
        Assert.Equal("Provider1", excelRemark.Provider);
        Assert.Equal("User5", excelRemark.CloseCaseBy);
        Assert.Equal("Football", excelRemark.Sport);
        Assert.Equal("Team A vs Team B", excelRemark.Event);
        Assert.Equal("Premier League", excelRemark.League);
        Assert.Equal("Yes", excelRemark.VarCheck);
    }

    [Fact]
    public async Task GetRemarksExcel_ActionIdNotFound_ReturnsEmptyAction()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var remark = new RemarkModel
        {
            RemarkId = 1,
            MatchId = 123,
            CreatedDate = DateTime.Now,
            ActionId = "999", // Non-existent action ID
            IsCheckedVar = false
        };
        var remarks = new List<RemarkModel> { remark };
        getRemarksService.GetRemarks(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);
        convertRequestsService.GetVarCheckValue(Arg.Any<bool>())
            .ReturnsForAnyArgs("No");

        // Act
        var result = await service.GetRemarksExcel(query);

        // Assert
        var excelRemark = result.First();
        Assert.Equal("", excelRemark.Action);
    }

    [Fact]
    public async Task GetRemarksExcel_NullActionId_ThrowsArgumentNullException()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var remark = new RemarkModel
        {
            RemarkId = 1,
            MatchId = 123,
            CreatedDate = DateTime.Now,
            ActionId = null,
            IsCheckedVar = false
        };
        var remarks = new List<RemarkModel> { remark };
        getRemarksService.GetRemarks(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);
        convertRequestsService.GetVarCheckValue(Arg.Any<bool>())
            .ReturnsForAnyArgs("No");

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(async () => await service.GetRemarksExcel(query));
    }

    [Fact]
    public async Task GetRemarksExcel_IsCheckedVarTrue_CallsGetVarCheckValueWithTrue()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var remark = new RemarkModel
        {
            RemarkId = 1,
            MatchId = 123,
            CreatedDate = DateTime.Now,
            ActionId = ActionRemarkConstant.Refund,
            IsCheckedVar = true
        };
        var remarks = new List<RemarkModel> { remark };
        getRemarksService.GetRemarks(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);
        convertRequestsService.GetVarCheckValue(true).Returns("Yes");

        // Act
        _ = await service.GetRemarksExcel(query);

        // Assert
        convertRequestsService.Received(1).GetVarCheckValue(true);
    }

    [Fact]
    public async Task GetRemarksExcel_IsCheckedVarFalse_CallsGetVarCheckValueWithFalse()
    {
        // Arrange
        var query = new SelectRemarksQuery { RemarkId = 1 };
        var remark = new RemarkModel
        {
            RemarkId = 1,
            MatchId = 123,
            CreatedDate = DateTime.Now,
            ActionId = ActionRemarkConstant.Refund,
            IsCheckedVar = false
        };
        var remarks = new List<RemarkModel> { remark };
        getRemarksService.GetRemarks(Arg.Any<SelectRemarksQuery>())
            .ReturnsForAnyArgs(remarks);
        convertRequestsService.GetVarCheckValue(false).Returns("No");

        // Act
        _ = await service.GetRemarksExcel(query);

        // Assert
        convertRequestsService.Received(1).GetVarCheckValue(false);
    }
}