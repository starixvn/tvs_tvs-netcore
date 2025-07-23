namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface GetInfoSiteDbDownService
{
    InfoSiteDBDownModel GetInfoSiteDBDown(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests);
}

public static class InfoSiteDbDownHelper
{
    public static InfoSiteDBDownModel Get(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests)
    {
        if (transInfoAddRequests.All(x => string.IsNullOrEmpty(x.SiteDBDownInfoJson)))
        {
            return null;
        }

        var siteDBDownInfo = transInfoAddRequests.First(x => x.SiteDBDownInfoJson != null);

        var infoSiteDBDown = new InfoSiteDBDownModel
        {
            SingleCount = siteDBDownInfo.SingleCount,
            ParlayCount = siteDBDownInfo.ParlayCount,
            CancelCashOutCount = siteDBDownInfo.CancelCashOutCount,
            Usernames = siteDBDownInfo.UserNames,
            SiteDBDownInfoJson = siteDBDownInfo.SiteDBDownInfoJson,
        };

        return infoSiteDBDown;
    }
}