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

public class ExportExcelDetailTicketsHandler : IRequestHandler<ExportExcelDetailTicketsRequest, ExcelFileModel>
{
    private readonly ExcelService<GetDetailTicketsQuery> excelService;

    public ExportExcelDetailTicketsHandler(ExcelService<GetDetailTicketsQuery> excelService)
    {
        this.excelService = excelService;
    }

    public async Task<ExcelFileModel> Handle(ExportExcelDetailTicketsRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTime.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"{request.MatchId}_Mark_Unmark_Tickets_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.CreateFileAsByteArray(request, TemplateExcelPath.MarkUnmarkTickets),
            FileName = fileName
        };
    }
}