using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverByBetId.Criteria;

public class RecoverTicketsCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "NAP_SpecialDelete_RecoverByBetId_Update");

    public override bool IsValid() => true;
}