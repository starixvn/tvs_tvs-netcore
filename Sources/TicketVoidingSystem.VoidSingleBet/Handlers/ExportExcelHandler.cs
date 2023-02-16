using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.VoidSingleBet.Criteria;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class ExportExcelRequest : GetTicketsQuery, IRequest<ExcelFileModel>
{
}

public class ExportExcelHandler : IAsyncRequestHandler<ExportExcelRequest, ExcelFileModel>
{
    private readonly ExcelService<GetTicketsQuery> excelService;

    public ExportExcelHandler(ExcelService<GetTicketsQuery> excelService)
    {
        this.excelService = excelService;
    }

    public async Task<ExcelFileModel> Handle(ExportExcelRequest message)
    {
        var createDate = $"{SystemTime.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"{message.MatchId}_Single_Tickets_{createDate}";
        return new ExcelFileModel
        {
            Content = await excelService.CreateStreamAsync(message, TemplateExcel.VoidSingleBet),
            FileName = fileName
        };
    }
}