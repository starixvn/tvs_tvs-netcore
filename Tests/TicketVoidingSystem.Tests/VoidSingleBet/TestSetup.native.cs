using AutoMapper;
using OfficeOpenXml;
using TicketVoidingSystem.VoidSingleBet;

namespace TicketVoidingSystem.Tests.VoidSingleBet;

internal static class TestSetup
{
    internal static IMapper CreateMapper()
    {
        var mockMapper = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new VoidSingleBetProfile());
        });

        return mockMapper.CreateMapper();
    }

    internal static ExcelWorksheet CreateTestingSheet()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        var package = new ExcelPackage();
        var sheet = package.Workbook.Worksheets.Add("Template");
        return sheet;
    }
}