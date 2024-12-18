using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class ExportExcelAccountRequest : ExportAccountWinLostQuery, IRequest<ExcelFileModel>;

public class ExportExcelAccountHandler(ExcelService<ExportAccountWinLostQuery> excelService)
    : IRequestHandler<ExportExcelAccountRequest, ExcelFileModel>
{
    public async Task<ExcelFileModel> Handle(ExportExcelAccountRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"TVS_AbnormalAccount_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketVoiding_AbnormalAccount),
            FileName = fileName
        };
    }
}