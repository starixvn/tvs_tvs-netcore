using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.TicketListing.Criteria;

namespace TicketVoidingSystem.TicketListing.Handlers
{
    public class ExportExcelRequest : ExportExcelQuery, IRequest<ExcelFileModel>
    {
    }

    public class ExportExcelHandler : IRequestHandler<ExportExcelRequest, ExcelFileModel>
    {
        private readonly ExcelService<ExportExcelQuery> excelService;

        public ExportExcelHandler(ExcelService<ExportExcelQuery> excelService)
        {
            this.excelService = excelService;
        }

        public async Task<ExcelFileModel> Handle(ExportExcelRequest request, CancellationToken cancellationToken)
        {
            var betTypeName = string.IsNullOrEmpty(request.BetTypeName) ? string.Empty : $"_{request.BetTypeName}";
            var fileName = string.Format(StringResource.FileNameExportExcel, betTypeName, request.LicenseeName).Replace(' ', '_');
            return new ExcelFileModel
            {
                ContentAsByteArray = await excelService.CreateFileAsByteArray(request, TemplateExcelPath.TicketListing),
                FileName = fileName
            };
        }
    }
}