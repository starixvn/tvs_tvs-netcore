using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class ExportVoidedTicketsRequest : GetVoidedTicketsQuery, IRequest<ExcelFileModel>
{
}

public class ExportVoidedTicketsHandler : IRequestHandler<ExportVoidedTicketsRequest, ExcelFileModel>
{
    private readonly ExcelService<GetVoidedTicketsQuery> excelService;

    public ExportVoidedTicketsHandler(ExcelService<GetVoidedTicketsQuery> excelService)
    {
        this.excelService = excelService;
    }

    public async Task<ExcelFileModel> Handle(ExportVoidedTicketsRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"Req.{request.RequestId}_TVS_DeleteBet_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketVoiding_VoidedTickets),
            FileName = fileName
        };
    }
}