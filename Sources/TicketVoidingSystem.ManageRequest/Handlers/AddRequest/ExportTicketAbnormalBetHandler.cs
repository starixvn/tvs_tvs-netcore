using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class ExportTicketAbnormalBet : CheckValidTransIdsModel, IRequest<ExcelFileModel>
{
}

public class ExportTicketAbnormalBetHandler : IRequestHandler<ExportTicketAbnormalBet, ExcelFileModel>
{
    private readonly ExcelService<CheckValidTransIdsModel> excelService;

    public ExportTicketAbnormalBetHandler(ExcelService<CheckValidTransIdsModel> excelService)
    {
        this.excelService = excelService;
    }

    public async Task<ExcelFileModel> Handle(ExportTicketAbnormalBet request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTime.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = request.RequestId == null ? $"TVS_AbnormalBet_{createDate}" : $"Req.{request.RequestId}_TVS_AbnormalBet_{createDate}";
        const string template = TemplateExcelPath.TicketVoiding_AbnormalBet;
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, template),
            FileName = fileName
        };
    }
}
