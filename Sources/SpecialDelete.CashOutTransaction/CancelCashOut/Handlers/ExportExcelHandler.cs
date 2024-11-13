using MediatR;
using SpecialDelete.CashOutTransaction.Common.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Handlers;

public class ExportExcelRequest : GetTicketsQuery, IRequest<ExcelFileModel>;

public class ExportExcelHandler(ExcelService<GetTicketsQuery> excelService)
    : IRequestHandler<ExportExcelRequest, ExcelFileModel>
{
    public async Task<ExcelFileModel> Handle(ExportExcelRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"Void_Cash_Out_Transaction_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.VoidCashOutTransaction),
            FileName = fileName
        };
    }
}