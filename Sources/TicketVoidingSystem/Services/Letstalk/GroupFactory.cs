namespace TicketVoidingSystem.Services.Letstalk;

public enum LetstalkGroupType
{
    VoidSettledBets,
    TicketListingAlert,
    TicketListingAlert777,
    AbnormalBetRequest
}

public static class GroupFactory
{
    public static string GetGroup(LetstalkGroupType type, bool isAllUusTicket)
    {
        var config = AppSettingService.AppSetting.LetstalkConfig;
        return config.IsProdEnv switch
        {
            true => GetConfigProdEnv(type, isAllUusTicket),
            false => GetConfigNonProdEnv(isAllUusTicket),
        };
    }

    private static string GetConfigProdEnv(LetstalkGroupType type, bool isAllUusTicket)
    {
        var config = AppSettingService.AppSetting.LetstalkConfig;

        if (isAllUusTicket)
        {
            return config.ItGroup;
        }

        return type switch
        {
            LetstalkGroupType.VoidSettledBets => config.VoidSettledBets,
            LetstalkGroupType.TicketListingAlert => config.TicketListingAlert,
            LetstalkGroupType.TicketListingAlert777 => config.TicketListingAlert777,
            LetstalkGroupType.AbnormalBetRequest => config.AbnormalBetRequest,
            _ => config.ItGroup
        };
    }

    private static string GetConfigNonProdEnv(bool isAllUusTicket)
    {
        var config = AppSettingService.AppSetting.LetstalkConfig;

        return isAllUusTicket ? config.ItGroup : config.ItGroupMockProd;
    }
}