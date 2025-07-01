namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface GetInfoSiteDbDownService
{
    InfoSiteDBDownModel GetInfoSiteDBDown(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests);
}

public class GetInfoSiteDbDownServiceImp : GetInfoSiteDbDownService
{
    public InfoSiteDBDownModel GetInfoSiteDBDown(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests)
    {
        if (transInfoAddRequests.All(x => x.SiteDBDownInfoJson == null))
        {
            return null;
        }

        var siteDBDownInfo = transInfoAddRequests.FirstOrDefault(x => x.SiteDBDownInfoJson != null);

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