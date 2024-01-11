using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.ExportExcel;

using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.VoidRequest;

public static class VoidRequest
{
    public static void RegisterVoidRequestServices(this IServiceCollection services)
    {
        services.AddTransient<CellService, CellServiceImp>();
        services.AddTransient<GetTicketsForExportExcelService, GetTicketsForExportExcelServiceImp>();
        services.AddTransient<WorkSheetService<GetTicketsQuery>, GetTicketsWorksheetService>();
        services.AddTransient<BetListCoreService, BetListCoreServiceImp>();
        services.AddTransient<CheckPermissionOnRequestService, CheckPermissionOnRequestServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<InsertVoidingHistoryService, InsertVoidingHistoryServiceImp>();
        services.AddTransient<MapTicketsService, MapTicketsServiceImp>();
        services.AddTransient<TicketsViewModelService, TicketsViewModelServiceImp>();
        services.RegisterInsertQueueServices();
    }
}