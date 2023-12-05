using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class ExportTicketAbnormalBetRequestTests
{
    private readonly ExcelService<CheckValidTransIdsModel> excelService;
    private readonly ExportTicketAbnormalBetHandler handler;

    public ExportTicketAbnormalBetRequestTests()
    {
        excelService = Substitute.For<ExcelService<CheckValidTransIdsModel>>();
        handler = new ExportTicketAbnormalBetHandler(excelService);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(null)]
    public async Task Handler_Successful_HasCalledExpected(int? requestId)
    {
        // Arrange
        const string template = "App_Data/Template/TicketVoiding_AbnormalBet.xlsx";
        var request = new ExportTicketAbnormalBet { RequestId = requestId };

        // Act
        await handler.Handle(request, CancellationToken.None);

        // Assert
        await excelService.Received(1).GenerateContentAsByteArray(Arg.Any<ExportTicketAbnormalBet>(), template);
    }
}