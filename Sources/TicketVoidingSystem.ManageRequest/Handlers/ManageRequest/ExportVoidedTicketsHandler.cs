using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class ExportVoidedTicketsRequest : GetVoidedTicketsQuery, IRequest<ExcelFileModel>;

public class ExportVoidedTicketsHandler(ExcelService<GetVoidedTicketsQuery> excelService)
    : IRequestHandler<ExportVoidedTicketsRequest, ExcelFileModel>
{
    public async Task<ExcelFileModel> Handle(ExportVoidedTicketsRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = request.IssueTypeId != IssueTypeConstant.RecoverTicket ? $"Req.{request.RequestId}_TVS_DeleteBet_{createDate}" : $"Req.{request.RequestId}_TVS_RecoverBet_{createDate}";
        var templatePath = request.IssueTypeId != IssueTypeConstant.RecoverTicket ? TemplateExcelPath.TicketVoiding_VoidedTickets : TemplateExcelPath.TicketVoiding_RecoveredTickets;
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, templatePath),
            FileName = fileName
        };
    }
}