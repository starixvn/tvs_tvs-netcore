namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public static class InfoSiteDbDownHelper
{
    public static InfoSiteDBDownModel Get(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests)
    {
        var siteDBDownInfo = transInfoAddRequests.FirstOrDefault(IsHasInfoSiteDbDown);
        if (siteDBDownInfo == null)
        {
            return null;
        }

        var infoSiteDBDown = new InfoSiteDBDownModel
        {
            SingleCount = siteDBDownInfo.SingleCount,
            ParlayCount = siteDBDownInfo.ParlayCount,
            CancelCashOutCount = siteDBDownInfo.CancelCashOutCount,
            SiteDBDownInfoJson = siteDBDownInfo.SiteDBDownInfoJson
        };

        return infoSiteDBDown;
    }

    public static InfoSiteDBDownModel GetModelForAbnormalAccount(ValidationInfo validationResult)
    {
        if (string.IsNullOrEmpty(validationResult.SiteDBDownInfoJson) && string.IsNullOrEmpty(validationResult.SiteDBDownUserNames))
        {
            return null;
        }

        var infoSiteDBDown = new InfoSiteDBDownModel
        {
            Usernames = validationResult.SiteDBDownUserNames,
            SiteDBDownInfoJson = validationResult.SiteDBDownInfoJson,
        };

        return infoSiteDBDown;
    }

    private static bool IsHasInfoSiteDbDown(TransInfoAddRequestModel model)
    {
        if (model == null)
        {
            return false;
        }

        return model.SingleCount + model.ParlayCount + model.CancelCashOutCount > 0
            || !string.IsNullOrEmpty(model.UserNames);
    }
}