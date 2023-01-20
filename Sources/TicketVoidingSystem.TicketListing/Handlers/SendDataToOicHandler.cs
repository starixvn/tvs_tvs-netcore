using MediatR;

namespace TicketVoidingSystem.TicketListing.Handlers
{
    public class SendDataToOicRequest : IRequest<IEnumerable<AmendmentReponse>>
    {
        public SendFileQuery[] Queries { get; set; }
    }

    public class SendDataOicHandler : IAsyncRequestHandler<SendDataToOicRequest, IEnumerable<AmendmentReponse>>
    {
        private readonly SendDataToOicService sendDataToOicService;
        private readonly TicketListingRepository ticketListingRepository;

        public SendDataOicHandler(SendDataToOicService sendDataToOicService, TicketListingRepository ticketListingRepository)
        {
            this.sendDataToOicService = sendDataToOicService;
            this.ticketListingRepository = ticketListingRepository;
        }

        public async Task<IEnumerable<AmendmentReponse>> Handle(SendDataToOicRequest message)
        {
            var resultLicensees = new List<AmendmentReponse>();
            var chinaViewQueries = message.Queries.Where(x => x.IsChinaView);
            var normalQueries = message.Queries.Where(x => !x.IsChinaView);
            var firstQuery = message.Queries.First();
            var affectedTickets = await ticketListingRepository.GetAffectTicketsFromSettlementHistory(firstQuery.IsReSettled, firstQuery.MatchId);
            if (normalQueries.Any())
            {
                var result = await sendDataToOicService.SendData(normalQueries.ToList(), affectedTickets);
                result.IsChinaView = false;

                resultLicensees.Add(result);
            }

            if (chinaViewQueries.Any())
            {
                var result = await sendDataToOicService.SendData(chinaViewQueries.ToList(), affectedTickets);
                result.IsChinaView = true;

                resultLicensees.Add(result);
            }

            return resultLicensees;
        }
    }
}