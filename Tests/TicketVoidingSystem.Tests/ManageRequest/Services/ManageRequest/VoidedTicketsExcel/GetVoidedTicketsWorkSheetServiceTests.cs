using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using OfficeOpenXml;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public class GetVoidedTicketsWorkSheetServiceTests
{
    private readonly CellService cellService;
    private readonly GetVoidedTicketsForExcelService getVoidedTicketsForExcelService;
    private readonly GetVoidedTicketsService getVoidedTicketsService;
    private readonly MatchService matchService;

    private readonly GetVoidedTicketsWorkSheetService service;

    public GetVoidedTicketsWorkSheetServiceTests()
    {
        cellService = Substitute.For<CellService>();
        getVoidedTicketsService = Substitute.For<GetVoidedTicketsService>();
        getVoidedTicketsForExcelService = Substitute.For<GetVoidedTicketsForExcelService>();
        matchService = Substitute.For<MatchService>();

        service = new GetVoidedTicketsWorkSheetService(cellService, getVoidedTicketsService,
            getVoidedTicketsForExcelService, matchService, null);
    }

    [Fact]
    public async Task BindingContent_SetsTitleAndInvokesMethods()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();

        var mockModel = new GetVoidedTicketsQuery
        {
            MatchId = 1
        };
        var mockMatch = new Match
        {
            MatchId = 1
        };
        getVoidedTicketsService.GetMatchInfo(Arg.Any<int>()).Returns(mockMatch);

        // Act
        await service.BindingContent(worksheet, mockModel);

        // Assert

        await getVoidedTicketsService.Received(1).GetMatchInfo(mockModel.MatchId.Value);
        matchService.Received(1).UpdateMatchInfoFromRemotingRef(mockMatch);
        cellService.Received(1).AddMatch(worksheet, mockMatch);
    }

    [Theory]
    [InlineData(IssueTypeConstant.AbnormalAccount, 1)]
    [InlineData(IssueTypeConstant.DangerAccepted, 0)]
    [InlineData(IssueTypeConstant.DangerAccepted, null)]
    [InlineData(IssueTypeConstant.AbnormalBet, 0)]
    public async Task BindingContent_AddTicketContentAndInvokesMethods(int issueTypeId, int? matchId)
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var mockModel = new GetVoidedTicketsQuery
        {
            MatchId = matchId,
            IssueTypeId = issueTypeId
        };

        getVoidedTicketsForExcelService.GetGroupsExcelTickets(Arg.Any<GetVoidedTicketsQuery>(), Arg.Any<Match>())
            .Returns(new List<Group<ExcelVoidedTicketModel>>
            {
                new()
                {
                    Name = "Test"
                }
            });
        // Act
        await service.BindingContent(worksheet, mockModel);

        // Assert

        await getVoidedTicketsService.Received(0).GetMatchInfo(Arg.Any<int>());
        matchService.Received(1).UpdateMatchInfoFromRemotingRef(Arg.Any<Match>());
        cellService.Received(1).AddMatch(Arg.Any<ExcelWorksheet>(), Arg.Any<Match>());
        cellService.Received(1).WriteGroupHeader(Arg.Any<ExcelWorksheet>(), Arg.Any<int>(), Arg.Any<Group<ExcelVoidedTicketModel>>());
    }
}