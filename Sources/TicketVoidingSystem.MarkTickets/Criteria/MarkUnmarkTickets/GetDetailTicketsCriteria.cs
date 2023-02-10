using System;
using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;

public class GetDetailTicketsCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedDate { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "Nap_SpecialDelete_AllMarkedTicketsDetail_Select");

    public override bool IsValid() => true;
}