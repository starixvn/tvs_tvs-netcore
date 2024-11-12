using MediatR;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Handlers;

public class ExportExcelRequest : ExportExcelQuery, IRequest<ExcelFileModel>
{
}

public class ExportExcelHandler(ExcelService<ExportExcelQuery> excelService)
    : IRequestHandler<ExportExcelRequest, ExcelFileModel>
{
    public async Task<ExcelFileModel> Handle(ExportExcelRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"Void_Parlay_Virtual_Sports_Bet_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.VoidParlayVirtualSportsBet),
            FileName = fileName
        };
    }
}