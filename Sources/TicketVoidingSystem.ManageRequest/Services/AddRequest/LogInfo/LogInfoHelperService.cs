namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

public static class LogInfoHelper
{
    public static Validation CombineValidations(IEnumerable<Validation> validations, Func<Validation, bool> filter)
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
            IsExistedInOtherRequest = selectedItems.Exists(x => x.IsExistedInOtherRequest),
            IsExistsSecondAccept = selectedItems.Exists(x => x.IsExistsSecondAccept),
            IsHasInstantlySettledTicket = selectedItems.Exists(x => x.IsHasInstantlySettledTicket),
            IsHasSettledTicket = selectedItems.Exists(x => x.IsHasSettledTicket),
            IsInvalidTotalTickets = selectedItems.TrueForAll(x => x.IsInvalidTotalTickets),
            IsPoolHouseAffected = selectedItems.Exists(x => x.IsPoolHouseAffected)
        };
    }

    public static IEnumerable<TicketRequest> CombineTicketRequest(IEnumerable<TicketRequest> ticketRequests, Func<TicketRequest, bool> filter)
    {
        return ticketRequests.Where(filter).GroupBy(x => x.RequestId).Select(group =>
        {
            var firstItem = group.First();
            return new TicketRequest
            {
                RequestId = group.Key,
                MatchId = firstItem.MatchId,
                Id = firstItem.Id,
                ScoreId = firstItem.ScoreId,
                CreatedBy = firstItem.CreatedBy,
                TransIds = group.Select(item => item.TransIds).Aggregate((a, b) => a + ", " + b)
            };
        });
    }

    public static TransInfoAddRequestModel CombineTransInfoAddRequest(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests)
    {
        return new TransInfoAddRequestModel
        {
            MarkTransIds = string.Join(",", transInfoAddRequests.Select(x => x.MarkTransIds)),
            UnMarkTransIds = string.Join(",", transInfoAddRequests.Select(x => x.UnMarkTransIds)),
            RemoveTransIds = string.Join(",", transInfoAddRequests.Select(x => x.RemoveTransIds)),
            TransInfoJson = string.Join(",", transInfoAddRequests.Select(x => x.TransInfoJson)),
        };
    }

    public static IEnumerable<BetTypeTicketsInfo> CombineBetTypeTickets(IEnumerable<BetTypeTicketsInfo> betTypeTickets, Func<BetTypeTicketsInfo, bool> filter)
    {
        return betTypeTickets.Where(filter);
    }

    public static LogInfoDetail CombineLogInfoDetail(IEnumerable<LogInfoDetail> logInfoDetails, Func<LogInfoDetail, bool> filter)
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
            LiveScores = GetLiveScore("|", selectedItems),
            ScoreOfMatch = selectedItems[0].ScoreOfMatch,
            ScoreNormalTicket = GetScoreNormalTicket("|", selectedItems),
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
            LogInfoTicketsJson = JoinStringValue(",", selectedItems.Select(x => x.LogInfoTicketsJson)),
            VoidFromTime = CombineVoidFromTime(selectedItems),
            VoidToTime = CombineVoidToTime(selectedItems),
            MinTransId = CombineMinTransId(selectedItems),
            HighlightAcceptType = CombineHighlightAcceptType(selectedItems),
            HighlightMinTime = CombineHighlightMinTime(selectedItems),
            ActionType = CombineActionType(selectedItems),
            TransVoidToTime = CombineTransVoidToTime(selectedItems)
        };
    }

    private static DateTime? CombineVoidFromTime(IEnumerable<LogInfoDetail> items)
    {
        return items.Select(x => x.VoidFromTime)
            .Where(x => x != null).Min(x => x);
    }

    private static DateTime? CombineVoidToTime(IEnumerable<LogInfoDetail> items)
    {
        return items.Select(x => x.VoidToTime)
            .Where(x => x != null).Max(x => x);
    }

    private static string CombineMinTransId(IEnumerable<LogInfoDetail> items)
    {
        return items.Select(x => x.MinTransId)
            .Where(x => !string.IsNullOrWhiteSpace(x)).Min(x => x);
    }

    private static int? CombineHighlightAcceptType(IEnumerable<LogInfoDetail> items)
    {
        return items.Where(x => x.MinTransId != null)
            .MinBy(x => x.MinTransId)?.HighlightAcceptType;
    }

    private static DateTime? CombineHighlightMinTime(IEnumerable<LogInfoDetail> items)
    {
        return items.Where(x => x.MinTransId != null)
            .MinBy(x => x.MinTransId)?.HighlightMinTime;
    }

    private static string CombineActionType(IEnumerable<LogInfoDetail> items)
    {
        return items.Where(x => !string.IsNullOrWhiteSpace(x.MinTransId))
            .MinBy(x => x.MinTransId)?.ActionType;
    }

    private static DateTime? CombineTransVoidToTime(IEnumerable<LogInfoDetail> items)
    {
        return items.Where(x => x.TransVoidToTime != null)
            .Max(x => x.TransVoidToTime);
    }

    private static string GetScoreNormalTicket(string? separator, List<LogInfoDetail> selectedItems)
    {
        var scores = selectedItems.SelectMany(x => (x.ScoreNormalTicket ?? "")
                .Split("|", StringSplitOptions.RemoveEmptyEntries)).Distinct();

        return string.Join(separator, scores);
    }

    private static string GetLiveScore(string? separator, List<LogInfoDetail> selectedItems)
    {
        var scores = selectedItems.SelectMany(x => (x.LiveScores ?? "")
            .Split("|", StringSplitOptions.RemoveEmptyEntries)).Distinct();

        return string.Join(separator, scores);
    }

    private static string JoinStringValue(string? separator, IEnumerable<string> items)
    {
        return string.Join(separator, items.Where(x => !string.IsNullOrWhiteSpace(x)));
    }
}