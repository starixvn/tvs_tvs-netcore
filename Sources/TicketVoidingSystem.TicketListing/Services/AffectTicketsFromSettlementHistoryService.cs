using Fanex.Data.Repository;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Extensions;

namespace TicketVoidingSystem.TicketListing.Services
{
    public interface AffectTicketsFromSettlementHistoryService
    {
        Task<string> GetTickets(bool isReSettled, int matchId);
    }

    public class AffectTicketsFromSettlementHistoryServiceImp : AffectTicketsFromSettlementHistoryService
    {
        private readonly IDynamicRepository repository;

        public AffectTicketsFromSettlementHistoryServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<string> GetTickets(bool isReSettled, int matchId)
        {
            if (!isReSettled)
            {
                return string.Empty;
            }

            var criteria = new GetSettlementHistoryCriteria
            {
                MatchId = matchId
            };
            var transIds = await repository.FetchAsync<BetId>(criteria);
            return transIds.ToAffectTicketsXml();
        }
    }
}