using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.CashOutTransaction.CancelCashOut.Services;
using SpecialDelete.CashOutTransaction.CancelCashOut.Services.ExportExcel;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.Repositories;
using SpecialDelete.CashOutTransaction.Common.Services;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class CancelCashOut
{
    public static void AddCancelCashOutServices(this IServiceCollection services)
    {
        services.AddTransient<Repository, RepositoryImp>();
        services.AddTransient<BetListCoreService, BetListCoreServiceImp>();
        services.AddTransient<TicketHtmlService, TicketHtmlServiceImp>();

        services.AddTransient<HandlerService, HandlerServiceImp>();
        services.AddTransient<DisplayUiService, DisplayUiServiceImp>();
        services.AddTransient<CheckPermissionService, CheckPermissionServiceImp>();
        services.AddTransient<VoidService, VoidServiceImp>();
        services.AddTransient<RemarkService, RemarkServiceImp>();

        services.AddTransient<WorkSheetService<GetTicketsQuery>, SheetControlImp>();
        services.AddTransient<SheetService, SheetServiceImp>();
    }
}