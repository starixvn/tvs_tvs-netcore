using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Repositories;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.Services.ExportExcel;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using SpecialDelete.VoidByCurrency.Services.VoidTickets;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class VoidByCurrency
{
    public static void AddVoidByCurrencyServices(this IServiceCollection services)
    {
        services.AddTransient<BetListCoreService, BetListCoreServiceImp>();
        services.AddTransient<CheckBoxService, CheckBoxServiceImp>();
        services.AddTransient<FilterAreaService, FilterAreaServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<TicketService, TicketServiceImp>();
        services.AddTransient<VoidTicketsService, VoidTicketsServiceImp>();
        services.AddTransient<VoidByCurrencyService, VoidByCurrencyServiceImp>();
        services.AddTransient<ConvertService, ConvertServiceImp>();
        services.AddTransient<VoidByCurrencyRepository, VoidByCurrencyRepositoryImp>();
        services.AddTransient<WorkSheetService<GetTicketsQuery>, SheetControlImp>();
        services.AddTransient<SheetService, SheetServiceImp>();
        services.AddTransient<ValidationService, ValidationServiceImp>();
    }
}