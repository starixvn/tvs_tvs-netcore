using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel;
using TicketVoidingSystem.Services.Excel;
using CellServiceRemarkListExcel = TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel.CellService;
using CellServiceImpRemarkListExcel = TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel.CellServiceImp;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class ManageRemark
{
    public static void AddManageRemarkServices(this IServiceCollection services)
    {
        services.AddTransient<AddRemarkService, AddRemarkServiceImp>();
        services.AddTransient<UpdateRemarkService, UpdateRemarkServiceImp>();
        services.AddTransient<DeleteRemarkService, DeleteRemarkServiceImp>();
        services.AddTransient<GetRemarksService, GetRemarksServiceImp>();
        services.AddTransient<GetRemarksInActiveTableService, GetRemarksInActiveTableServiceImp>();
        services.AddTransient<GetRemarksInArchivedTableService, GetRemarksInArchivedTableServiceImp>();
        services.AddTransient<RenderRemarkService, RenderRemarkServiceImp>();
        services.AddTransient<GetRemarksForExcelService, GetRemarksForExcelServiceImp>();
        services.AddTransient<CellServiceRemarkListExcel, CellServiceImpRemarkListExcel>();
        services.AddTransient<WorkSheetService<SelectRemarksQuery>, RemarkListWorksheetService>();
        services.AddTransient<GetRemarkService, GetRemarkServiceImp>();
    }
}