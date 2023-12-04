using OfficeOpenXml;
namespace TicketVoidingSystem.Tests;

internal static class SetupTestingSheet
{
    internal static ExcelWorksheet CreateTestingSheet()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var package = new ExcelPackage();
        var sheet = package.Workbook.Worksheets.Add("Template");
        return sheet;
    }
}