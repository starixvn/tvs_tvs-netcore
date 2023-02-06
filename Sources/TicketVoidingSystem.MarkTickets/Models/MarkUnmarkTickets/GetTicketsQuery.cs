using System.Collections.Generic;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets
{
    public class GetTicketsQuery
    {
        public byte Status { get; set; }

        public byte SearchBy { get; set; }

        public int MatchId { get; set; }

        public IEnumerable<TransDateXmlModel> Durations { get; set; }

        public short? LiveIndicator { get; set; }

        public short? LiveHomeScore { get; set; }

        public short? LiveAwayScore { get; set; }

        public string CurrencyIDs { get; set; }

        public string LicenseeNames { get; set; }

        public IEnumerable<BetTypeXml> BetTypes { get; set; }

        public string TransIds { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public Match Match { get; set; }

        public string Bet { get; set; }
    }
}