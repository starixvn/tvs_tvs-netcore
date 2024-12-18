using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.VoidByBetId.Services;

namespace TicketVoidingSystem.Website.ViewComponents;

public class VoidByBetIdFilter(RemarkService remarkService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var viewModel = await remarkService.GetInfo();

        return View(viewModel);
    }
}