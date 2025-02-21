using Fanex.Data;
using Fanex.Data.Repository;

namespace SpecialDelete.VirtualSports.RecoverBet.Criteria;

public class UpdateTicketsVs2RacingCriteria : NonQueryCommand
{
    public string TransInfoJson { get; set; }

    public int ErrorCode { get; set; }

    public string ErrorMsg { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => "UpdateTicketsVs2Racing";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransInfoJson);
}