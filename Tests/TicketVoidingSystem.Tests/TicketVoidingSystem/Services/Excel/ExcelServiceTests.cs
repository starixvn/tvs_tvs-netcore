using OfficeOpenXml;
using System.Threading.Tasks;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.Services.Excel;
using Xunit;
using NSubstitute;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Excel
{
    public class ExcelServiceTests
    {
        [Fact]
        public async Task GenerateContentAsByteArray_CorrectContent_ReturnByteArray()
        {
            // Arrange
            var model = Substitute.For<ExportExcelRequest>();
            var templatePath = "../../../../../TicketVoidingSystem.Website/App_Data/Template/TicketVoiding_ManageRequest.xlsx";
            var workSheetService = Substitute.For<WorkSheetService<ExportExcelRequest>>();
            
            var excelService = new ExcelServiceImp<ExportExcelRequest>(workSheetService);

            // Act
            var result = await excelService.GenerateContentAsByteArray(model, templatePath);

            // Assert
            Assert.NotNull(result);
            await workSheetService.Received().BindingContent(Arg.Any<ExcelWorksheet>(), Arg.Any<ExportExcelRequest>());
        }        
    }
}
