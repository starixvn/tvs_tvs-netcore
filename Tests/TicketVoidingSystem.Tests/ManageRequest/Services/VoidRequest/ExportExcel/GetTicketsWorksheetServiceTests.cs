using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.ExportExcel;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest.ExportExcel;

public class GetTicketsWorksheetServiceTests
{
    private readonly CellService cellService;
    private readonly GetTicketsForExportExcelService getTicketsForExportExcelService;
    private readonly GetTicketsWorksheetService service;

    public GetTicketsWorksheetServiceTests()
    {
        cellService = Substitute.For<CellService>();
        getTicketsForExportExcelService = Substitute.For<GetTicketsForExportExcelService>();
        service = new GetTicketsWorksheetService(getTicketsForExportExcelService, cellService);
    }

    [Fact]
    public async Task BindingContent_WithMatchNotNull_HasGetGroupsExcelTickets()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var model = new GetTicketsQuery
        {
            Match = new Match { MatchId = 1 }
        };

        var groupsExcelTickets = new List<Group<ExcelTicketModel>>
        {
            new()
            {
                Name = "Group 1",
                Tickets = new List<ExcelTicketModel> { new() }
            },
            new()
            {
                Name = "Group 2",
                Tickets = new List<ExcelTicketModel> { new() }
            }
        };
        cellService.CreateTitle(0).ReturnsForAnyArgs("1");
        getTicketsForExportExcelService.GetGroupsExcelTickets(Arg.Any<GetTicketsQuery>())
            .ReturnsForAnyArgs(groupsExcelTickets);

        // Act
        await service.BindingContent(worksheet, model);

        // Assert
        await getTicketsForExportExcelService.Received().GetGroupsExcelTickets(Arg.Any<GetTicketsQuery>());
    }

    [Fact]
    public async Task BindingContent_WithMatchNull_HasGetGroupsExcelTicketsRequestNoMatch()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var model = new GetTicketsQuery();
        var groupsExcelTickets = new List<Group<ExcelTicketNoMatchModel>>
        {
            new()
            {
                Name = "Group 1",
                Tickets = new List<ExcelTicketNoMatchModel> { new() }
            },
            new()
            {
                Name = "Group 2",
                Tickets = new List<ExcelTicketNoMatchModel> { new() }
            }
        };
        getTicketsForExportExcelService.GetGroupsExcelTicketsRequestNoMatch(Arg.Any<GetTicketsQuery>())
            .ReturnsForAnyArgs(groupsExcelTickets);

        // Act
        await service.BindingContent(worksheet, model);

        // Assert
        await getTicketsForExportExcelService.Received()
            .GetGroupsExcelTicketsRequestNoMatch(Arg.Any<GetTicketsQuery>());
    }
}