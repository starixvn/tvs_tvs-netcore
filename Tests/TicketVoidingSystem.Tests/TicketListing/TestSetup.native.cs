using AutoMapper;
using OfficeOpenXml;
using TicketVoidingSystem.TicketListing;

namespace TicketVoidingSystem.Tests.TicketListing;

internal static class TestSetup
{
    internal static IMapper CreateMapper()
    {
        var mockMapper = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new TicketListingProfile());
        });

        return mockMapper.CreateMapper();
    }

    internal static ExcelWorksheet CreateTestingSheet()
    {
        var package = new ExcelPackage();
        var sheet = package.Workbook.Worksheets.Add("Template");
        return sheet;
    }
}