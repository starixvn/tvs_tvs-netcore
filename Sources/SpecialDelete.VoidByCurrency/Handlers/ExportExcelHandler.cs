using MediatR;
using SpecialDelete.VoidByCurrency.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.VoidByCurrency.Handlers;

public class ExportExcelRequest : GetTicketsQuery, IRequest<ExcelFileModel>;

public class ExportExcelHandler(ExcelService<GetTicketsQuery> excelService)
    : IRequestHandler<ExportExcelRequest, ExcelFileModel>
{
    public async Task<ExcelFileModel> Handle(ExportExcelRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"{request.MatchId}_Currency_Tickets_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.VoidByCurrency),
            FileName = fileName
        };
    }
}