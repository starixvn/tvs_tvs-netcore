using Fanex.Data.Repository;

namespace TicketVoidingSystem.TicketListing.Criteria
{
    public class SendDataOicCriteria : NonQueryCommand
    {
        public string SessionID { get; set; }

        public string SiteName { get; set; }

        public int MatchId { get; set; }

        public DateTime EventDate { get; set; }

        public string ResultAmendmentXml { get; set; }

        public override string GetSettingKey() => "NAP_SpecialDelete_TicketListing_SendOIC";

        public override bool IsValid() => true;
    }
}