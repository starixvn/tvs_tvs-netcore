using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

public class ExportRemark : SelectRemarksQuery, IRequest<ExcelFileModel>;

public class ExportRemarkHandler(ExcelService<SelectRemarksQuery> excelService)
    : IRequestHandler<ExportRemark, ExcelFileModel>
{
    public async Task<ExcelFileModel> Handle(ExportRemark request, CancellationToken cancellationToken)
    {
        var createDate = $"{DateTimeOffset.Now:yyyy_MM_dd_HH_mm_ss}";
        var fileName = $"Manage_Remark_TVS_{createDate}";
        return new ExcelFileModel
        {
            ContentAsByteArray = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketVoiding_ManageRemark),
            FileName = fileName
        };
    }
}

