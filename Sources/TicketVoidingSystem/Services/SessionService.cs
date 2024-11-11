using System.Threading.Tasks;
using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Business;
using Fanex.NAP.Client.Services;
using Microsoft.AspNetCore.Http;

namespace TicketVoidingSystem.Services;

public interface SessionService
{
    int UserId { get; }

    string UserName { get; }

    Task<bool> HasPermission(string functionKey, Constant.Policy policy);

    string GetClientIp();

    bool CheckPassword(string encodedPassword);
}

public class SessionServiceImp : SessionService
{
    private readonly INapSession currentSession;
    private readonly IUserService userService;
    private readonly INapSettings siteSettings;
    private readonly IHttpContextAccessor httpContextAccessor;

    public SessionServiceImp(INapSession currentSession, IUserService userService, INapSettings siteSettings, IHttpContextAccessor httpContextAccessor)
    {
        this.currentSession = currentSession;
        this.userService = userService;
        this.siteSettings = siteSettings;
        this.httpContextAccessor = httpContextAccessor;
    }

    public int UserId => currentSession.UserId;

    public string UserName => currentSession.UserName;

    public async Task<bool> HasPermission(string functionKey, Constant.Policy policy)
    {
        return await userService.IsHavingPermissionAsync(currentSession.UserId, siteSettings.SiteId, functionKey, policy);
    }

    public string GetClientIp()
    {
        return httpContextAccessor.HttpContext.Connection.RemoteIpAddress.Equals(httpContextAccessor.HttpContext
            .Connection.LocalIpAddress)
            ? "127.0.0.1"
            : httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
    }

    public bool CheckPassword(string encodedPassword)
    {
        var user = userService.Get(UserId);
        return encodedPassword.Equals(user.Password);
    }
}