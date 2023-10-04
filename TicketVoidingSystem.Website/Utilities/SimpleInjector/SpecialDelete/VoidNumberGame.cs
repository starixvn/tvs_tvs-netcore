using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using SpecialDelete.NumberGame.Services.GetTickets;
using SpecialDelete.NumberGame.Services.VoidTickets;
using SpecialDelete.NumberGame.Services.VoidTickets.ExportExcel;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class VoidNumberGame
{
    public static void RegisterVoidNumberGameServices(this IServiceCollection services)
    {
        services.AddTransient<Repository, RepositoryImp>();
        services.AddTransient<BetListCoreService, BetListCoreServiceImp>();
        services.AddTransient<TicketService, TicketServiceImp>();
        services.AddTransient<VoidService, VoidServiceImp>();
        services.AddTransient<WorkSheetService<GetVoidTicketsQuery>, SheetControlImp>();
        services.AddTransient<SheetService, SheetServiceImp>();
    }
}