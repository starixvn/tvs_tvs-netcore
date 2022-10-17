namespace TicketVoidingSystem.MarkTickets.Models
{
    using System.Collections.Generic;
    using Core.Constants;
    using Core.Services;

    public class MarkTicketsModel
    {
        public List<MatchMarkTicket> Matches { get; set; }
        public string InvalidTransIds { get; set; }
        public int ErrCode { get; set; }
        public string ErrMsg { get; set; }
    }

    public class MatchMarkTicket
    {
        public int MatchId { get; set; }
        public int HomeId { get; set; }
        public int AwayId { get; set; }
        public int SportType { get; set; }
        public bool IsNeutral { get; set; }

        public string HomeName => IsNeutral ?
            RemotingWrapper.GetTeamName(HomeId, LanguageCode.English) + " (N)" : RemotingWrapper.GetTeamName(HomeId, LanguageCode.English);

        public string AwayName => RemotingWrapper.GetTeamName(AwayId, LanguageCode.English);
    }
}