using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

public interface LogInfoHelperService
{
    Task UpdateBetTypeTicketsInfo(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets);

    TransInfoAddRequestModel CombineTransInfoAddRequest(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests);

    LogInfoDetail CombineLogInfoDetail(IEnumerable<LogInfoDetail> logInfoDetails, Func<LogInfoDetail, bool> filter);

    Validation CombineValidations(IEnumerable<Validation> validations, Func<Validation, bool> filter);

    IEnumerable<TicketRequest> CombineTicketRequest(IEnumerable<TicketRequest> ticketRequests, Func<TicketRequest, bool> filter);

    IEnumerable<BetTypeTicketsInfo> CombineBetTypeTickets(IEnumerable<BetTypeTicketsInfo> betTypeTickets,
        Func<BetTypeTicketsInfo, bool> filter);
}

public class LogInfoHelperServiceImp(BetListService betListService, CopyRequestInfoService copyRequestInfoService) : LogInfoHelperService
{
    public Validation CombineValidations(IEnumerable<Validation> validations, Func<Validation, bool> filter)
    {
        var selectedItems = validations.Where(filter).ToList();
        if (selectedItems.Count == 0)
        {
            return null;
        }

        return new Validation
        {
            MatchId = selectedItems[0].MatchId,
            Id = selectedItems[0].Id,
            ScoreId = selectedItems[0].ScoreId,
            IsExistedInOtherRequest = selectedItems.TrueForAll(x => x.IsExistedInOtherRequest),
            IsExistsSecondAccept = selectedItems.TrueForAll(x => x.IsExistsSecondAccept),
            IsHasInstantlySettledTicket = selectedItems.TrueForAll(x => x.IsHasInstantlySettledTicket),
            IsHasSettledTicket = selectedItems.TrueForAll(x => x.IsHasSettledTicket),
            IsInvalidTotalTickets = selectedItems.TrueForAll(x => x.IsInvalidTotalTickets),
            IsPoolHouseAffected = selectedItems.TrueForAll(x => x.IsPoolHouseAffected)
        };
    }

    public IEnumerable<TicketRequest> CombineTicketRequest(IEnumerable<TicketRequest> ticketRequests, Func<TicketRequest, bool> filter)
    {
        return ticketRequests.Where(filter);
    }

    public LogInfoDetail CombineLogInfoDetail(IEnumerable<LogInfoDetail> logInfoDetails, Func<LogInfoDetail, bool> filter)
    {
        var selectedItems = logInfoDetails.Where(filter).ToList();
        if (selectedItems.Count == 0)
        {
            return null;
        }

        return new LogInfoDetail
        {
            MatchId = selectedItems[0].MatchId,
            Id = selectedItems[0].Id,
            ScoreId = selectedItems[0].ScoreId,
            ActionType = selectedItems.Min(x => x.MinTransId),
            LiveScores = string.Join("|", selectedItems.Select(x => x.LiveScores)),
            ScoreOfMatch = selectedItems[0].ScoreOfMatch,
            ScoreNormalTicket = string.Join("|", selectedItems.Select(x => x.ScoreNormalTicket)),
            MinTransId = selectedItems.Min(x => x.MinTransId),
            HighlightAcceptType = selectedItems.MinBy(x => x.MinTransId)?.HighlightAcceptType,
            HighlightMinTime = selectedItems.MinBy(x => x.MinTransId)?.HighlightMinTime,
            SingleCount = selectedItems.Sum(x => x.SingleCount),
            MainParlayCount = selectedItems.Sum(x => x.MainParlayCount),
            CashOutCount = selectedItems.Sum(x => x.CashOutCount),
            CancelCashOutCount = selectedItems.Sum(x => x.CancelCashOutCount),
            SettleCount = selectedItems.Sum(x => x.SettleCount),
            InstantlySettleCount = selectedItems.Sum(x => x.InstantlySettleCount),
            PoolHouseCashOutCount = selectedItems.Sum(x => x.PoolHouseCashOutCount),
            PoolHouseInstantlySettleCount = selectedItems.Sum(x => x.PoolHouseInstantlySettleCount),
            PoolHouseMainParlayCount = selectedItems.Sum(x => x.PoolHouseMainParlayCount),
            PoolHouseSettleCount = selectedItems.Sum(x => x.PoolHouseSettleCount),
            PoolHouseSingleCount = selectedItems.Sum(x => x.PoolHouseSingleCount),
            LogInfoTicketsJson = string.Join(",", selectedItems.Select(x => x.LogInfoTicketsJson)),
            VoidFromTime = selectedItems.Min(x => x.VoidFromTime),
            VoidToTime = selectedItems.Max(x => x.VoidToTime),
            TransVoidToTime = selectedItems.Max(x => x.TransVoidToTime)
        };
    }

    public TransInfoAddRequestModel CombineTransInfoAddRequest(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests)
    {
        return new TransInfoAddRequestModel
        {
            MarkTransIds = string.Join(",", transInfoAddRequests.Select(x => x.MarkTransIds)),
            UnMarkTransIds = string.Join(",", transInfoAddRequests.Select(x => x.UnMarkTransIds)),
            RemoveTransIds = string.Join(",", transInfoAddRequests.Select(x => x.RemoveTransIds)),
            TransInfoJson = string.Join(",", transInfoAddRequests.Select(x => x.TransInfoJson)),
        };
    }

    public IEnumerable<BetTypeTicketsInfo> CombineBetTypeTickets(IEnumerable<BetTypeTicketsInfo> betTypeTickets, Func<BetTypeTicketsInfo, bool> filter)
    {
        return betTypeTickets.Where(filter);
    }

    public async Task UpdateBetTypeTicketsInfo(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        UpdateBetTypeName(betTypeTickets);
        await UpdatePlayerNameForBetTypeNextManOut(matchId, betTypeTickets);
    }

    private void UpdateBetTypeName(IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        foreach (var item in betTypeTickets)
        {
            item.BetTypeName = betListService.GetBetTypeName(new Ticket
            {
                BetTypeId = item.BetTypeId,
                BetId = item.BetId
            });
        }
    }

    private async Task UpdatePlayerNameForBetTypeNextManOut(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        await copyRequestInfoService.UpdatePlayerNameForBetTypeNextManOut(matchId, betTypeTickets);
    }
}