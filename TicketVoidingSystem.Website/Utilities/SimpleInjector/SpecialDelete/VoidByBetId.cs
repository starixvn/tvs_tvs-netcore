using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Repositories;
using SpecialDelete.VoidByBetId.Services;
using SpecialDelete.VoidByBetId.Services.ExportExcel;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class VoidByBetId
{
    public static void AddVoidByBetIdServices(this IServiceCollection services)
    {
        services.AddTransient<BetListCoreService, BetListCoreServiceImp>();
        services.AddTransient<ConditionService, ConditionServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<TicketService, TicketServiceImp>();
        services.AddTransient<HandleService, HandleServiceImp>();
        services.AddTransient<AfterVoidService, AfterVoidServiceImp>();
        services.AddTransient<LetstalkService, LetstalkServiceImp>();
        services.AddTransient<VoidByBetIdRepository, VoidByBetIdRepositoryImp>();
        services.AddTransient<WorkSheetService<GetTicketsQuery>, SheetControlImp>();
        services.AddTransient<SheetService, SheetServiceImp>();
        services.AddTransient<RemarkService, RemarkServiceImp>();
    }
}