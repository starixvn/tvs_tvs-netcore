using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.RecoverTicket;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.AddRequest;

public static class AbnormalBet
{
    public static void RegisterAbnormalBetServices(this IServiceCollection services)
    {
        services.AddTransient<CellService, CellServiceImp>();
        services.AddTransient<WorkSheetService<CheckValidTransIdsModel>, GetTicketsForExportExcelService>();
        services.AddTransient<MapAbnormalBetTicketsExcelService, MapAbnormalBetTicketsExcelServiceImp>();
        services.AddTransient<CheckValidTransIdsService, CheckValidTransIdsServiceImp>();
        services.AddTransient<CheckRecoverTicketService, CheckRecoverTicketServiceImp>();
    }
}