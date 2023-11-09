using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class ExportExcelAccountRequest : ExportAccountWinLostQuery, IRequest<ExcelFileModel>
{
}

public class ExportExcelAccountHandler : IRequestHandler<ExportExcelAccountRequest, ExcelFileModel>
{
    private readonly ExcelService<ExportAccountWinLostQuery> excelService;

    public ExportExcelAccountHandler(ExcelService<ExportAccountWinLostQuery> excelService)
    {
        this.excelService = excelService;
    }

    public async Task<ExcelFileModel> Handle(ExportExcelAccountRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTime.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"TVS_AbnormalAccount_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketVoiding_AbnormalAccount),
            FileName = fileName
        };
    }
}