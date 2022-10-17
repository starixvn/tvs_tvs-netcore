namespace TicketVoidingSystem.MarkTickets.Handlers
{
    using Common.Constants;
    using Common.Excel;
    using Common.Models;
    using Common.Systems;
    using Criteria;
    using MediatR;

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

        public ExcelFileModel Handle(ExportExcelRequest message)
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
