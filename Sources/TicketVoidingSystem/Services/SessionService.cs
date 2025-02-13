using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.NAP.Client;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Business;
using Fanex.NAP.Client.Models.ValueObject;
using Fanex.NAP.Client.Services;
using Microsoft.AspNetCore.Http;

namespace TicketVoidingSystem.Services;

public interface SessionService
{
    int UserId { get; }

    string UserName { get; }

    Task<bool> HasPermission(string functionKey, Constant.Policy policy);

    Task<IEnumerable<FunctionPolicy>> GetPermissionsAsync(string parentFunctionKey, Constant.Policy policy);

    string GetClientIp();

    bool CheckPassword(string encodedPassword);
}

public class SessionServiceImp(
    INapSession currentSession,
    IUserService userService,
    INapSettings siteSettings,
    IHttpContextAccessor httpContextAccessor)
    : SessionService
{
    public int UserId => currentSession.UserId;

    public string UserName => currentSession.UserName;

    public async Task<bool> HasPermission(string functionKey, Constant.Policy policy)
    {
        return await userService.IsHavingPermissionAsync(currentSession.UserId, siteSettings.SiteId, functionKey, policy);
    }

    public async Task<IEnumerable<FunctionPolicy>> GetPermissionsAsync(string parentFunctionKey, Constant.Policy policy)
    {
        return await userService.GetPermissionsAsync(currentSession.UserId, siteSettings.SiteId, parentFunctionKey);
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