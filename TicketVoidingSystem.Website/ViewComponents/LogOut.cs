using System.Threading.Tasks;
using Fanex.NAP.Client.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.Website.ViewComponents;

public class LogOut : ViewComponent
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public LogOut(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public async Task<IViewComponentResult> InvokeAsync(string userName)

    {
        var oldSiteAbsolutePath = AppSettingService.AppSetting.OldSiteRootUrl.StartsWith('/') ?
             $"https://{httpContextAccessor.HttpContext.Request.Host}{AppSettingService.AppSetting.OldSiteRootUrl}"
             : AppSettingService.AppSetting.OldSiteRootUrl;
        var logoutInfo = new MenuItem
        {
            Name = userName,
            Url = oldSiteAbsolutePath
        };
        return await Task.FromResult<IViewComponentResult>(View(logoutInfo));
    }
}