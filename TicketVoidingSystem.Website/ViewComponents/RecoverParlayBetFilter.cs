using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.RecoverParlayBet.Services;

namespace TicketVoidingSystem.Website.ViewComponents;

public class RecoverParlayBetFilter : ViewComponent
{
    private readonly PermissionService permissionService;

    public RecoverParlayBetFilter(PermissionService permissionService)
    {
        this.permissionService = permissionService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var viewModel = await permissionService.GetPermission();

        return View(viewModel);
    }
}