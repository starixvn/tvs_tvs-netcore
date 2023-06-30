using Fanex.Data.Repository;

namespace TicketVoidingSystem.TicketListing.Criteria;

public class SendDataOicCriteria : NonQueryCommand
{
    public int MatchId { get; set; }

    public DateTime EventDate { get; set; }

    public string TransInfoSendOICJson { get; set; }

    public override string GetSettingKey() => "NAP_SpecialDelete_TicketListing_SendOIC";

    public override bool IsValid() => true;
}