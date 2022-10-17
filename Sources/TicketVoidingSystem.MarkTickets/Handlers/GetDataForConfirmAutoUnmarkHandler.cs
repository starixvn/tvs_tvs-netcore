using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.BetList.Core.Entities;
using MediatR;
using SpecialDelete.Common.Services;
using SpecialDelete.Core.Constants;
using SpecialDelete.Core.Services;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.GetTickets;
using TicketVoidingSystem.MarkTickets.ViewModels;

namespace TicketVoidingSystem.MarkTickets.Handlers
{
    public class GetDataForConfirmAutoUnmarkRequest : GetDataForConfirmAutoUnmarkQuery,
        IRequest<GetDataForConfirmAutoUnmarkViewModel>
    {
    }

    public class GetDataForConfirmAutoUnmarkHandler : IAsyncRequestHandler<GetDataForConfirmAutoUnmarkRequest,
        GetDataForConfirmAutoUnmarkViewModel>
    {
        private readonly IGetTicketsService getTicketsService;
        private readonly IPagingService paggingService;
        private readonly BetListService betListService;

        public GetDataForConfirmAutoUnmarkHandler(
            IGetTicketsService getTicketsService,
            IPagingService paggingService,
            BetListService betListService)
        {
            this.getTicketsService = getTicketsService;
            this.paggingService = paggingService;
            this.betListService = betListService;
        }

        public async Task<GetDataForConfirmAutoUnmarkViewModel> Handle(GetDataForConfirmAutoUnmarkRequest message)
        {
            var model = new GetDataForConfirmAutoUnmarkViewModel();

            var data = (await getTicketsService.GetDataForConfirmAutoUnmark(message)).ToList();

            model.TotalItems = data.Count;

            var dataPaging = paggingService.Paging(data, message.PageIndex, message.PageSize);

            model.Items = CreateViewModel(dataPaging);

            return model;
        }

        private IEnumerable<ConfirmAutoUnmarkViewModel> CreateViewModel(IEnumerable<ConfirmAutoUnmarkModel> model)
        {
            var index = 1;
            return model.Select(itemModel => new ConfirmAutoUnmarkViewModel
            {
                No = index++,
                IsConfirm = itemModel.IsConfirm,
                MatchId = itemModel.MatchId,
                HTScore = itemModel.HTScore,
                FTScore = itemModel.FTScore,
                Bettype = itemModel.Bettype,
                BetId = ParseBetId(itemModel.BetId),
                BettypeName = GetBettypeName(itemModel.Bettype, itemModel.BetId),
                KickOffTime = itemModel.KickOffTime,
                UserId = itemModel.UserId,
                MarkedBy = itemModel.MarkedBy,
                TotalItems = itemModel.MarkedTrans,
                SportName = RemotingWrapper.GetSportName(itemModel.SportType.ToString(), ""),
                Event = RemotingWrapper.GetTeamName(itemModel.HomeId, LanguageCode.English) + " - vs - " +
                        RemotingWrapper.GetTeamName(itemModel.AwayId, LanguageCode.English),
                MarkType = itemModel.MarkType
            });
        }

        private string GetBettypeName(int bettype, string betid)
        {
            var ticket = new Ticket
            {
                BetId = ParseBetId(betid),
                BetTypeId = bettype
            };
            return betListService.GetBetTypeName(ticket);
        }

        private static long? ParseBetId(string betId)
        {
            var isParseSuccess = long.TryParse(betId, out var betIdNumber);
            if (isParseSuccess)
            {
                return betIdNumber;
            }

            return null;
        }
    }
}