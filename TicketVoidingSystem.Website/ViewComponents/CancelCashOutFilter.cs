using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.CashOutTransaction.CancelCashOut.Services;

namespace TicketVoidingSystem.Website.ViewComponents;

public class CancelCashOutFilter : ViewComponent
{
    private readonly RemarkService remarkService;

    public CancelCashOutFilter(RemarkService remarkService)
    {
        this.remarkService = remarkService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var viewModel = await remarkService.GetInfoPermissionCancelCashOut();

        return View(viewModel);
    }
}