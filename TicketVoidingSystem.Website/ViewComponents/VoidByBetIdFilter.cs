using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SpecialDelete.VoidByBetId.Services;

namespace TicketVoidingSystem.Website.ViewComponents;

public class VoidByBetIdFilter : ViewComponent
{
    private readonly RemarkService remarkService;

    public VoidByBetIdFilter(RemarkService remarkService)
    {
        this.remarkService = remarkService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var viewModel = await remarkService.GetInfo();

        return View(viewModel);
    }
}