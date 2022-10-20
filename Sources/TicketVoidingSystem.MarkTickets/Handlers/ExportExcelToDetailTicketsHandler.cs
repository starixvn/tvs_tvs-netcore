namespace TicketVoidingSystem.MarkTickets.Handlers
{
    using Common.Constants;
    using Common.Excel;
    using Common.Models;
    using Common.Systems;
    using Criteria;
    using MediatR;
    using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

    public class ExportExcelToDetailTicketsRequest : GetDetailTicketsQuery, IRequest<ExcelFileModel>
    {
    }

    public class ExportExcelToDetailTicketsHandler : IRequestHandler<ExportExcelToDetailTicketsRequest, ExcelFileModel>
    {
        private readonly ExcelService<GetDetailTicketsQuery> excelService;

        public ExportExcelToDetailTicketsHandler(ExcelService<GetDetailTicketsQuery> excelService)
        {
            this.excelService = excelService;
        }

        public ExcelFileModel Handle(ExportExcelToDetailTicketsRequest message)
        {
            var createDate = $"{SystemTime.Now:yyyy_MM_dd_HH_mm_ss}";
            var fileName = $"{message.MatchId}_Mark_Unmark_Tickets_{createDate}";
            return new ExcelFileModel
            {
                Content = excelService.CreateStream(message, TemplateExcel.MarkUnmarkTickets),
                FileName = fileName
            };
        }
    }
}
