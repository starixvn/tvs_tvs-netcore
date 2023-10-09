using MediatR;
using SpecialDelete.NumberGame.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.NumberGame.Handlers;

public class ExportExcelRequest : GetVoidTicketsQuery, IRequest<ExcelFileModel>
{
}

public class ExportExcelHandler : IRequestHandler<ExportExcelRequest, ExcelFileModel>
{
    private readonly ExcelService<GetVoidTicketsQuery> excelService;

    public ExportExcelHandler(ExcelService<GetVoidTicketsQuery> excelService)
    {
        this.excelService = excelService;
    }

    public async Task<ExcelFileModel> Handle(ExportExcelRequest request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTime.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"Void_Number_Game_Tickets_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.VoidNumberGameBet),
            FileName = fileName
        };
    }
}