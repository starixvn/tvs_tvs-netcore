using System.Collections.Generic;
using System.Linq;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;

public interface MapDataForConfirmAutoUnmarkService
{
    IEnumerable<ConfirmAutoUnmarkViewModel> MapToConfirmAutoUnmarkViewModels(IEnumerable<ConfirmAutoUnmarkModel> models);
}

public class MapDataForConfirmAutoUnmarkServiceImp : MapDataForConfirmAutoUnmarkService
{
    private readonly RemotingRefWrapperService remotingRefService;
    private readonly BetListService betListService;

    public MapDataForConfirmAutoUnmarkServiceImp(RemotingRefWrapperService remotingRefService, BetListService betListService)
    {
        this.remotingRefService = remotingRefService;
        this.betListService = betListService;
    }

    public IEnumerable<ConfirmAutoUnmarkViewModel> MapToConfirmAutoUnmarkViewModels(IEnumerable<ConfirmAutoUnmarkModel> models)
    {
        var index = 1;
        return models.Select(itemModel => new ConfirmAutoUnmarkViewModel
        {
            No = index++,
            IsConfirm = itemModel.IsConfirm,
            MatchId = itemModel.MatchId,
            HTScore = itemModel.HTScore,
            FTScore = itemModel.FTScore,
            Bettype = itemModel.Bettype,
            BetId = ParseBetId(itemModel.BetId),
            BettypeName = GetBetTypeName(itemModel.Bettype, itemModel.BetId),
            KickOffTime = itemModel.KickOffTime,
            UserId = itemModel.UserId,
            MarkedBy = itemModel.MarkedBy,
            TotalItems = itemModel.MarkedTrans,
            SportName = remotingRefService.GetSportName(itemModel.SportType.ToString(), ""),
            Event = $"{remotingRefService.GetTeamName(itemModel.SportType, itemModel.HomeId, LanguageCode.English)} - vs - {remotingRefService.GetTeamName(itemModel.SportType, itemModel.AwayId, LanguageCode.English)}",
            MarkType = itemModel.MarkType,
            ChildMatchId = itemModel.ChildMatchId
        }).ToList();
    }

    private string GetBetTypeName(int betType, string betId)
    {
        var ticket = new Ticket
        {
            BetId = ParseBetId(betId),
            BetTypeId = betType
        };
        return betListService.GetBetTypeName(ticket);
    }

    private static long? ParseBetId(string betId)
    {
        var isParseSuccess = long.TryParse(betId, out var betIdNumber);
        return isParseSuccess ? betIdNumber : null;
    }
}