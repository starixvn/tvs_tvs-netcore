using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Services;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class ExportExcelRequest : ExportExcelQuery, IRequest<ExcelFileModel>
{
}

public class ExportExcelHandler : IRequestHandler<ExportExcelRequest, ExcelFileModel>
{
    private readonly ExcelService<ExportExcelQuery> excelService;
    private readonly GetTicketsService getTicketsService;

    public ExportExcelHandler(ExcelService<ExportExcelQuery> excelService, GetTicketsService getTicketsService)
    {
        this.excelService = excelService;
        this.getTicketsService = getTicketsService;
    }

    public async Task<ExcelFileModel> Handle(ExportExcelRequest request, CancellationToken cancellationToken)
    {
        var betTypeName = string.IsNullOrEmpty(request.BetTypeName) ? string.Empty : $"_{request.BetTypeName}";
        var fileName = string.Format(StringResource.FileNameExportExcel, betTypeName, request.LicenseeName).Replace(' ', '_');
        request.Tickets = await getTicketsService.GetTicketsForExportExcel(request);

        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketListing),
            FileName = fileName
        };
    }
}