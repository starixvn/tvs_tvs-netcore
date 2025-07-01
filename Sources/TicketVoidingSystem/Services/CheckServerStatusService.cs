using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.SiteDbConnectionManager.Client.Services;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services;

public interface CheckServerStatusService
{
    Task<List<SiteDbGroupModel>> GetOnlineServer();
}

public class CheckServerStatusServiceImp(SiteDbClientService siteDbClientService) : CheckServerStatusService
{
    public async Task<List<SiteDbGroupModel>> GetOnlineServer()
    {
        var onlineServer = await siteDbClientService.GetActiveSiteDbAsync();
        return onlineServer.Select(x => new SiteDbGroupModel
        {
            Id = x.SiteDbGroupId,
            IsOnline = x.Status,
            ServerName = SiteDbGroupConstant.AllSiteDb.Find(y => y.Id == x.SiteDbGroupId)?.ServerName
        }).ToList();
    }
}