using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class ExportExcelRequest : GetTicketsQuery, IRequest<ExcelFileModel>;

public class ExportExcelHandler(ExcelService<GetTicketsQuery> excelService)
    : IRequestHandler<ExportExcelRequest, ExcelFileModel>
{
    public async Task<ExcelFileModel> Handle(ExportExcelRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"Req.{request.RequestId}_TVS_{createDate}";
        var template = request.Match != null ? TemplateExcelPath.TicketVoiding_VoidTickets : TemplateExcelPath.TicketVoiding_VoidTickets_NoMatch;
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, template),
            FileName = fileName
        };
    }
}