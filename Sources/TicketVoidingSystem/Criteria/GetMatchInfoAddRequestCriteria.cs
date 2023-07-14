using System;
using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria;

public class GetMatchInfoAddRequestCriteria : CriteriaBase
{
    public DateTime EventDate { get; set; }
    public int SportType { get; set; }
    public int? MatchId { get; set; }
    public bool IsUpdRequest { get; set; }
    public int ErrorCode { get; set; }
    public string ErrorMsg { get; set; }

    public override string GetSettingKey() => "TicketVoiding_MatchInfo_Select";

    public override bool IsValid() => true;
}