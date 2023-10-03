using System.Threading.Tasks;
using Fanex.NAP.Client.Session;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Website.ViewComponents;

public class Menu : ViewComponent
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public Menu(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var session = new NapSession(httpContextAccessor);
        var menuItems = Helper.UpdateNapMenuItem(session.MenuItemList, httpContextAccessor);

        return await Task.FromResult<IViewComponentResult>(View(menuItems));
    }
}