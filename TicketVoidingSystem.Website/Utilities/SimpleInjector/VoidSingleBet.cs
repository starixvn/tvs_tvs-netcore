using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Services.ExportExcel;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class VoidSingleBet
{
    public static void AddVoidSingleBetServices(this IServiceCollection services)
    {
        services.AddTransient<CellService, CellServiceImp>();
        services.AddTransient<WorkSheetService<GetTicketsQuery>, GetTicketsWorksheetService>();

        services.AddTransient<CheckBoxService, CheckBoxServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<GroupTicketService, GroupTicketServiceImp>();
        services.AddTransient<MapTicketService, MapTicketServiceImp>();
        services.AddTransient<PermissionService, PermissionServiceImp>();
        services.AddTransient<UpdateListTicketsViewModelService, UpdateListTicketsViewModelServiceImp>();

        services.AddTransient<AfterVoidService, AfterVoidServiceImp>();
        services.AddTransient<NetPositionForCricketService, NetPositionForCricketServiceImp>();
        services.AddTransient<VoidTicketsService, VoidTicketsServiceImp>();
    }
}