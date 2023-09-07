using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Handlers;

public class ExportExcelHandlerTests
{
    [Fact]
    public async Task Handle_ReturnExpectedExcelFileModel()
    {
        // Arrange
        var request = new ExportExcelRequest { MatchId = 456 };
        var excelService = Substitute.For<ExcelService<GetTicketsQuery>>();
        var handler = new ExportExcelHandler(excelService);
        var expectedContentFile = new byte[] { 1, 2, 3 };
        excelService.GenerateContentAsByteArray(Arg.Any<GetTicketsQuery>(), Arg.Is<string>(x => x == TemplateExcelPath.VoidSingleBet))
            .Returns(expectedContentFile);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal($"{request.MatchId}_Single_Tickets_", actual.FileName[..19]);
        Assert.Equal(expectedContentFile, actual.ContentAsByteArray);
    }
}