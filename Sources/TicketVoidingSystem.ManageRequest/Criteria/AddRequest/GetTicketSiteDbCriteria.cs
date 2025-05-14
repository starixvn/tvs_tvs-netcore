using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetTicketSiteDbCriteria : CriteriaBase
{
    public int IssueTypeId { get; set; }

    public string KickOffInfo { get; set; }

    public string WrongScoreInfo { get; set; }

    public string DangerAcceptedInfo { get; set; }

    public string RedCardInfo { get; set; }

    public string WrongHdpInfo { get; set; }

    public string Wrong1stHdpInfo { get; set; }

    public string WrongOuInfo { get; set; }

    public string Wrong1stOuInfo { get; set; }

    public string WrongOddsInfo { get; set; }

    public string ReducedOverInfo { get; set; }

    public string NotParticipateInfo { get; set; }

    public string AbnormalBetTransIds { get; set; }

    public string AbnormalAccounts { get; set; }

    public string ArchivedTransIds { get; set; }

    public string RecoverTicketInfo { get; set; }

    public string WrongMarketOfferedInfo { get; set; }

    public string TechnicalErrorInfo { get; set; }

    public string WrongOddsSBInfo { get; set; }

    public string WrongOfferedNameInfo { get; set; }

    public string OtherIssuesInfo { get; set; }

    public string MatchEarlyCompletedInfo { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_TransInfo_Select");

    public override bool IsValid() => true;
}