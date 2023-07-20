using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class ReCalculateTicketCommand : NonQueryCommand
{
    public int ErrCode { get; set; }

    public string ErrMsg { get; set; }

    public int? MatchId { get; set; }

    public string TransIds { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    public string NegativeBalanceUsers { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_ReCalculate_Single_PreUpdate");

    public override bool IsValid() => true;
}