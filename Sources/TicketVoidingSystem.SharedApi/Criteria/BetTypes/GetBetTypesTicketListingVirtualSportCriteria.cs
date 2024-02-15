using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.BetTypes;

public class GetBetTypesTicketListingVirtualSportCriteria : CriteriaBase
{
    public int ErrCode { get; set; }

    public string ErrMsg { get; set; }

    public int MatchId { get; set; }

    public string BetTypes { get; set; }

    public override string GetSettingKey() => "NAP_BetTypeSel_TicketListing_VirtualSport";

    public override bool IsValid() => true;
}