using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using OfficeOpenXml;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;

public class RequestListWorksheetServiceTests
{
    private readonly CellService cellService;
    private readonly GetRequestsForExcelService getRequestsForExcelService;

    private readonly RequestListWorksheetService service;

    public RequestListWorksheetServiceTests()
    {
        getRequestsForExcelService = Substitute.For<GetRequestsForExcelService>();
        cellService = Substitute.For<CellService>();

        service = new RequestListWorksheetService(getRequestsForExcelService, cellService);
    }

    [Fact]
    public async Task BindingContent_RendersDataAndAppliesStyleToWorksheet()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var package = new ExcelPackage();
        var sheet = package.Workbook.Worksheets.Add("Template");

        var query = new SelectRequestsQuery();
        var requests = new List<ExcelRequestModel>
        {
            new() { RequestId = 1 },
            new() { RequestId = 2 },
            new() { RequestId = 3 }
        };

        getRequestsForExcelService.GetRequestsExcel(query).Returns(requests);

        // Act
        await service.BindingContent(sheet, query);

        // Assert
        await getRequestsForExcelService.Received(1).GetRequestsExcel(query);
        cellService.Received(1).RenderDataWorksheet(sheet, requests);
        cellService.Received(1).SetStyle(sheet);
    }
}