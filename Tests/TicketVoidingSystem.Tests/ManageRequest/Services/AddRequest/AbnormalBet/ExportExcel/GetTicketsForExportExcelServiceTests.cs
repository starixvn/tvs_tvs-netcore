using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;

public class GetTicketsForExportExcelServiceTests
{
    private readonly CellService cellService;
    private readonly GetTicketsForExportExcelService service;
    private readonly CheckValidTransIdsService checkValidTransIdsService;

    public GetTicketsForExportExcelServiceTests()
    {
        cellService = Substitute.For<CellService>();
        checkValidTransIdsService = Substitute.For<CheckValidTransIdsService>();
        service = new GetTicketsForExportExcelService(cellService, checkValidTransIdsService);
    }

    [Fact]
    public async Task BindingContent_WithMatchNotNull_HasGetGroupsExcelTickets()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var model = new CheckValidTransIdsModel();
        var checkTransIdViewModel = new CheckValidTransIdsViewModel
        {
            AbnormalBetTicketRequests = new List<AbnormalBetTicketViewModel>()
        };
        checkValidTransIdsService.CheckValidTransIds(model).ReturnsForAnyArgs(checkTransIdViewModel);

        // Act
        await service.BindingContent(worksheet, model);

        // Assert
        checkValidTransIdsService.Received(1).CheckValidTransIds(model);
        cellService.Received(1).SetStyle(Arg.Any<ExcelWorksheet>());
    }
}