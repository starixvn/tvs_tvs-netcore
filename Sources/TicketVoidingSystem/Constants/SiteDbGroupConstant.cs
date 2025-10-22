using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.Constants;

public static class SiteDbGroupConstant
{
    public const int CentralDb = 0;
    public const int SiteDb1 = 1;
    public const int SiteDb2 = 2;
    public const int SiteDb3 = 3;

    public static readonly List<SiteDbGroupModel> AllSiteDb =
    [
        new() { Id = CentralDb, ServerName = "DBCTG" },
        new() { Id = SiteDb1, ServerName = "DBSITE01" },
        new() { Id = SiteDb2, ServerName = "DBSITE02" },
        new() { Id = SiteDb3, ServerName = "DBSITE03" }
    ];

    static SiteDbGroupConstant()
    {
        var ignoreSiteDbList = !string.IsNullOrWhiteSpace(AppSettingService.AppSetting?.IgnoreSiteDb)
            ? AppSettingService.AppSetting.IgnoreSiteDb.Split(',').Select(int.Parse)
            : [];

        ServerList = ignoreSiteDbList.Any() ? AllSiteDb.Where(site => ignoreSiteDbList.All(y => y != site.Id)).ToList() : AllSiteDb;
    }

    public static List<SiteDbGroupModel> ServerList { get; }
}