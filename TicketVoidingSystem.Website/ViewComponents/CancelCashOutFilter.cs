using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.CashOutTransaction.CancelCashOut.Services;

namespace TicketVoidingSystem.Website.ViewComponents;

public class CancelCashOutFilter(RemarkService remarkService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var viewModel = await remarkService.GetInfoPermissionCancelCashOut();

        return View(viewModel);
    }
}