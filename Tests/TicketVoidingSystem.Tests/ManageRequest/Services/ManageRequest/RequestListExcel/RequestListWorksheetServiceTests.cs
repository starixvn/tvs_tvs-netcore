using NSubstitute;
using OfficeOpenXml;
using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;
public class RequestListWorksheetServiceTests
{
    private readonly GetRequestsForExcelService getRequestsForExcelService;
    private readonly CellService cellService;

    private RequestListWorksheetService service;

    public RequestListWorksheetServiceTests()
    {
        getRequestsForExcelService = Substitute.For<GetRequestsForExcelService>();
        cellService = Substitute.For<CellService>();

        service = new RequestListWorksheetService(getRequestsForExcelService, cellService);
    }

    [Fact]
    public async void BindingContent_RendersDataAndAppliesStyleToWorksheet()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var package = new ExcelPackage();
        var sheet = package.Workbook.Worksheets.Add("Template");

        var query = new SelectRequestsQuery();
        var requests = new List<ExcelRequestModel>
        {
            new ExcelRequestModel { RequestId = 1 },
            new ExcelRequestModel { RequestId = 2 },
            new ExcelRequestModel { RequestId = 3 }
        };

        getRequestsForExcelService.GetRequestsExcel(query).Returns(requests);

        // Act
        await service.BindingContent(sheet, query);

        // Assert
        getRequestsForExcelService.Received(1).GetRequestsExcel(query);
        cellService.Received(1).RenderDataWorksheet(sheet, requests);
        cellService.Received(1).SetStyle(sheet);
    }
}
