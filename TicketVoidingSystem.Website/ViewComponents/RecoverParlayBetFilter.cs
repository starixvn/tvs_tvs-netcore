using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.RecoverParlayBet.Services;

namespace TicketVoidingSystem.Website.ViewComponents;

public class RecoverParlayBetFilter(PermissionService permissionService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var viewModel = await permissionService.GetPermission();

        return View(viewModel);
    }
}