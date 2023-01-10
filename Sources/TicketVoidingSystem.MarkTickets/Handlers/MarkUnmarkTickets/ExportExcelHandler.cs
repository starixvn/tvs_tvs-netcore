using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.MarkTickets.Handlers.MarkUnmarkTickets
{
    public class ExportExcelRequest : GetTicketsQuery, IRequest<ExcelFileModel>
    {
    }

    public class ExportExcelHandler : IRequestHandler<ExportExcelRequest, ExcelFileModel>
    {
        private readonly ExcelService<GetTicketsQuery> excelService;

        public ExportExcelHandler(ExcelService<GetTicketsQuery> excelService)
        {
            this.excelService = excelService;
        }

        public async Task<ExcelFileModel> Handle(ExportExcelRequest request, CancellationToken cancellationToken)
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
}