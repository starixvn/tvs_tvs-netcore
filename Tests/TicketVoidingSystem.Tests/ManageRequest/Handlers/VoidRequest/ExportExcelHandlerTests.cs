using System;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest;

public class ExportExcelHandlerTests
{
    [Fact]
    public async Task ExportExcel_RequestHasMatchIsNull_ReturnFileNameWithDateTime()
    {
        var request = new ExportExcelRequest { RequestId = 12345 };
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd}";
        var expected = $"Req.{request.RequestId}_TVS_{createDate}";
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Contains(expected, model.FileName);
    }

    [Fact]
    public async Task ExportExcel_RequestHasMatchIsNotNull_ReturnFileNameWithDateTime()
    {
        var request = new ExportExcelRequest { RequestId = 12345, Match = new Match() };
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd}";
        var expected = $"Req.{request.RequestId}_TVS_{createDate}";
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);

        // Act
        var model = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Contains(expected, model.FileName);
    }
}