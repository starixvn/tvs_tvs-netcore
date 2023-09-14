using System.Threading.Tasks;
using Fanex.NAP.Client.Session;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        return await Task.FromResult<IViewComponentResult>(View(session.MenuItemList));
    }

}