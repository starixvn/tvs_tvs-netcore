namespace TicketVoidingSystem.Tests.Extensions
{
    public class ControllerExtensionTests
    {
        // [Fact]
        // public void ExcelFileResult_Returns_FileContentResult()
        // {
        //     // Arrange
        //     var controller = Substitute.For<ControllerBase>();
        //     var httpResponse = Substitute.For<HttpResponse>();
        //     var excelFile = new ExcelFileModel
        //     {
        //         FileName = "test",
        //         ContentAsByteArray = new byte[] { 1, 2, 3, 4 }
        //     };

        //     // Act
        //     var result = controller.ExcelFileResult(httpResponse, excelFile);

        //     // Assert
        //     Assert.IsType<FileContentResult>(result);
        //     Assert.Equal("attachment;filename=test.xlsx", httpResponse.Headers["Content-Disposition"]);
        //     Assert.Equal(excelFile.ContentAsByteArray, result.FileContents);
        // }
    }
}
