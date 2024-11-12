using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets;

public class ExportExcelDetailTicketsRequest : GetDetailTicketsQuery, IRequest<ExcelFileModel>
{
}

public class ExportExcelDetailTicketsHandler(ExcelService<GetDetailTicketsQuery> excelService)
    : IRequestHandler<ExportExcelDetailTicketsRequest, ExcelFileModel>
{
    public async Task<ExcelFileModel> Handle(ExportExcelDetailTicketsRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"{request.Match.MatchId}_Mark_Unmark_Tickets_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.MarkUnmarkTickets),
            FileName = fileName
        };
    }
}