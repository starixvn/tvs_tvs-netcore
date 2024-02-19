using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Handlers;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Handlers;

public class ExportExcelHandlerTest
{
    [Fact]
    public async Task ExportExcel_ValidBetTypeName_FileNameExpandBetType()
    {
        // Arrange
        const string expected = "Ticket_Listing_for_Bettype_Handicap_";
        var request = new ExportExcelRequest { BetTypeName = "Handicap" };
        var excelService = Substitute.For<ExcelService<ExportExcelQuery>>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTicketsForExportExcel(Arg.Any<ExportExcelRequest>()).ReturnsForAnyArgs(new List<ExcelTicketModel>());
        var handler = new ExportExcelHandler(excelService, getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual.FileName);
    }

    [Fact]
    public async Task ExportExcel_BetTypeNameIsEmpty_FileNameHasNotBetTypeName()
    {
        // Arrange
        const string expected = "Ticket_Listing_for_Bettype_";
        var request = new ExportExcelRequest { BetTypeName = string.Empty };
        var excelService = Substitute.For<ExcelService<ExportExcelQuery>>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTicketsForExportExcel(Arg.Any<ExportExcelRequest>()).ReturnsForAnyArgs(new List<ExcelTicketModel>());
        var handler = new ExportExcelHandler(excelService, getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual.FileName);
    }
}