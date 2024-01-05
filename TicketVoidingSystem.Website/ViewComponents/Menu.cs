using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.NAP.Client.Models;
using Microsoft.AspNetCore.Mvc;

namespace TicketVoidingSystem.Website.ViewComponents;

public class Menu : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync(IEnumerable<MenuItem> menuItems)
    {
        return await Task.FromResult<IViewComponentResult>(View(menuItems));
    }
}