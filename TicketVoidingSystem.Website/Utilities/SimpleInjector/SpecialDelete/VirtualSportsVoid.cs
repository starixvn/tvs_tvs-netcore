using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Repositories;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.ExportExcel;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.VoidTickets;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class VirtualSportsVoid
{
    public static void RegisterVirtualSportsVoidServices(this IServiceCollection services)
    {
        services.AddTransient<BetListVirtualSportsService, BetListVirtualSportsServiceImp>();
        services.AddTransient<TicketService, TicketServiceImp>();

        //void
        services.AddTransient<Repository, RepositoryImp>();
        services.AddTransient<VoidBetListService, VoidBetListServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<VoidTicketsService, VoidTicketsServiceImp>();
        services.AddTransient<WorkSheetService<ExportExcelQuery>, SheetControlImp>();
        services.AddTransient<SheetService, SheetServiceImp>();
    }
}