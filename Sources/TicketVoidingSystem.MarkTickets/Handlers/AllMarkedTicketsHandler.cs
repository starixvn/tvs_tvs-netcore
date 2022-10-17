using System.Collections.Generic;
using System.Linq;
using MediatR;

namespace TicketVoidingSystem.MarkTickets.Handlers
{
    public class AllMarkedTicketsRequest : AllMarkedTicketsQuery, IRequest<AllMarkedTicketsViewModel>
    {
    }

    public class AllMarkedTicketsHandler : IRequestHandler<AllMarkedTicketsRequest, AllMarkedTicketsViewModel>
    {
        private readonly IGetTicketsService getTicketsService;
        private readonly IPagingService pagingService;

        public AllMarkedTicketsHandler(
            IGetTicketsService getTicketsService,
            IPagingService pagingService)
        {
            this.getTicketsService = getTicketsService;
            this.pagingService = pagingService;
        }

        public AllMarkedTicketsViewModel Handle(AllMarkedTicketsRequest message)
        {
            var model = new AllMarkedTicketsViewModel();
            var data = getTicketsService.GetAllMarkedTickets(message).ToList();
            model.TotalItems = data.Count;

            var dataPaging = pagingService.Paging(data, message.PageIndex, message.PageSize);
            model.TicketList = UpdateViewModel(dataPaging);

            return model;
        }

        private static IEnumerable<AllMarkedTicketViewModel> UpdateViewModel(IEnumerable<AllMarkedTicketModel> model)
        {
            var index = 1;
            return model.Select(itemModel => new AllMarkedTicketViewModel
            {
                No = index++,
                IsChecked = true,
                UserId = itemModel.UserId,
                Username = itemModel.Username,
                MatchId = itemModel.MatchId,
                HTScore = itemModel.HTScore,
                FTScore = itemModel.FTScore,
                KickOffTime = itemModel.KickOffTime,
                CreatedDate = itemModel.CreatedDate,
                Total = itemModel.Total,
                Event = RemotingWrapper.GetTeamName(itemModel.HomeId, LanguageCode.English) + "- vs -" + RemotingWrapper.GetTeamName(itemModel.AwayId, LanguageCode.English)
            });
        }
    }
}