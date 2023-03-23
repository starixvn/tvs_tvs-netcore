using AutoMapper;
using OfficeOpenXml;

namespace TicketVoidingSystem.MarkTickets.Tests
{
    internal static class TestSetup
    {
        internal static IMapper CreateMapper()
        {
            var mockMapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MarkTicketsProfile());
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
}