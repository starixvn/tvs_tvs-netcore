using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Criteria;

public class VoidTicketsCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public string Username { get; set; }

    public string Password { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    public string Reason { get; set; }

    public string ReasonSC { get; set; }

    public byte? AbnormalBetType { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_VoidBetIdList_Upd");

    public override bool IsValid() => true;
}