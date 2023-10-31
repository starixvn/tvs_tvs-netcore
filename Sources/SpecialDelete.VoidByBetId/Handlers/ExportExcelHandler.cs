using MediatR;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.VoidByBetId.Handlers;

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
        var fileName = $"Void_By_Bet_ID_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.VoidByBetId),
            FileName = fileName
        };
    }
}