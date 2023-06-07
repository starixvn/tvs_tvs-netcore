using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ExportExcel;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.UserLogs;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class MarkTickets
{
    public static void RegisterMarkTicketsServices(this IServiceCollection services)
    {
        services.AddTransient<CombineValidationService, CombineValidationServiceImp>();
        services.AddTransient<ConfirmAutoUnmarkService, ConfirmAutoUnmarkServiceImp>();
        services.AddTransient<MapDataForConfirmAutoUnmarkService, MapDataForConfirmAutoUnmarkServiceImp>();
        services.AddTransient<UpdateConfirmAutoUnmarkService, UpdateConfirmAutoUnmarkServiceImp>();
        services.AddTransient<CellService, CellServiceImp>();
        services.AddTransient<WorkSheetService<GetDetailTicketsQuery>, GetDetailTicketsWorkSheetService>();
        services.AddTransient<WorkSheetService<GetTicketsQuery>, GetTicketsWorkSheetService>();
        services.AddTransient<CheckBoxService, CheckBoxServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<MapTicketService, MapTicketServiceImp>();
        services.AddTransient<MarkTicketsService, MarkTicketsServiceImp>();
        services.AddTransient<MarkAllTicketsService, MarkAllTicketsServiceImp>();
        services.AddTransient<MapUserLogsService, MapUserLogsServiceImp>();
        services.AddTransient<UserLogsService, UserLogsServiceImp>();
        services.AddTransient<UserPermissionService, UserPermissionServiceImp>();
    }
}