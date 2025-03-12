using System.IO.Compression;
using System.Text;
using System.Text.Json;
using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface GetTicketsService
{
    Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query);
}

public class GetTicketsServiceImp(
    IMapper mapper,
    IDynamicRepository repository,
    GetTransInfoService getTransInfoService,
    LoggingService loggingService)
    : GetTicketsService
{
    public async Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query)
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.EarlyKickOffTime or IssueTypeConstant.WrongKickOffTime =>
                await GetTicketsIssueTypeEarlyKickOffOrWrongKickOff(query),
            IssueTypeConstant.ArchivedTicket => await GetTicketsIssueTypeArchivedTicket(query),
            IssueTypeConstant.AbnormalAccount or IssueTypeConstant.AbnormalBet =>
                await GetTicketsRangeActiveAndBackup(query),
            _ => await GetTicketsDefault(query)
        };
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsRangeActiveAndBackup(GetTicketsQuery query)
    {
        var (singleTickets, parlayTickets, cancelCashOutTickets)
            = await GetTicketsInRequest(query.RequestId, query.RequestDetailId);
        var transInfoJsonVoid14List = await getTransInfoService.GetTransInfoJsonForVoid14(singleTickets, GetMatchIdForQueryTransInfoJson(query));
        var transInfoJsonList = await getTransInfoService.GetTransInfoJsonForVoid(singleTickets, parlayTickets, cancelCashOutTickets, GetMatchIdForQueryTransInfoJson(query));
        var void14Tickets = await GetBetTrans14Ticket(query, transInfoJsonVoid14List);
        var voidBetTransTickets = await GetBetTransTicket(query, transInfoJsonList);

        return void14Tickets.Union(voidBetTransTickets);
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsIssueTypeArchivedTicket(GetTicketsQuery query)
    {
        var (singleTickets, _, _) = await GetTicketsInRequest(query.RequestId, query.RequestDetailId);
        var transInfoJsonVoid14List = await getTransInfoService.GetTransInfoJsonForVoid14(singleTickets, GetMatchIdForQueryTransInfoJson(query));

        return await GetBetTrans14Ticket(query, transInfoJsonVoid14List);
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsIssueTypeEarlyKickOffOrWrongKickOff(GetTicketsQuery query)
    {
        if (query.RequestId is null or 0) // get tickets when add/edit request
        {
            var transInfoJson = new List<string> { query.TransInfoJson };
            return await GetBetTransTicket(query, transInfoJson);
        }

        var (singleTickets, parlayTickets, cancelCashOutTickets)
            = await GetTicketsInRequest(query.RequestId, query.RequestDetailId);
        var matchId = GetMatchIdForQueryTransInfoJson(query);
        var transInfoJsonList = await getTransInfoService.GetTransInfoJsonForVoid(singleTickets, parlayTickets, cancelCashOutTickets, matchId);

        return await GetBetTransTicket(query, transInfoJsonList);
    }

    private async Task<IEnumerable<GetTicketModel>> GetTicketsDefault(GetTicketsQuery query)
    {
        var (singleTickets, parlayTickets, cancelCashOutTickets) = await GetTicketsInRequest(query.RequestId, query.RequestDetailId);
        await LogSentryGetTicketsInRequest(query.RequestId, singleTickets, parlayTickets, cancelCashOutTickets);

        var matchId = GetMatchIdForQueryTransInfoJson(query);
        var transInfoJsonList = await getTransInfoService.GetTransInfoJsonForVoid(singleTickets, parlayTickets, cancelCashOutTickets, matchId);
        await LogSentryGetTransInfoJsonForVoid(query.RequestId, matchId, transInfoJsonList);

        var tickets = await GetBetTransTicket(query, transInfoJsonList);
        await LogSentryGetBetTransTicket(query.RequestId, matchId, tickets);

        return tickets;
    }

    private async Task<IEnumerable<GetTicketModel>> GetBetTransTicket(GetTicketsQuery query, IEnumerable<string> transInfoJsonList)
    {
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        criteria.MatchId = query.Match?.MatchId ?? 0;
        //criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));

        var tickets = await repository.FetchAsync<GetTicketModel>(criteria);
        return tickets.OrderBy(x => x.IsMixParlay);
    }

    private async Task<IEnumerable<GetTicketModel>> GetBetTrans14Ticket(GetTicketsQuery query, IEnumerable<string> transInfoJsonList)
    {
        var criteria = mapper.Map<GetBetTrans14TicketsCriteria>(query);
        //criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));
        var tickets = await repository.FetchAsync<GetTicketModel>(criteria);

        return tickets.OrderBy(x => x.IsMixParlay);
    }

    private static int? GetMatchIdForQueryTransInfoJson(GetTicketsQuery query)
    {
        return query.Match?.MatchId > 0 ? query.Match.MatchId : null;
    }

    private async Task<(IEnumerable<BetId> SingleTickets, IEnumerable<BetId> ParlayTickets, IEnumerable<BetId> CancelCashOutTickets)> GetTicketsInRequest(int? requestId,
        int? requestDetailId)
    {
        var criteria = new GetTicketInRequestCriteria
        {
            RequestId = requestId ?? 0,
            RequestDetailId = requestDetailId
        };

        return await repository.FetchMultipleAsync<BetId, BetId, BetId>(criteria);
    }

    // Log data void page to trace issue missing ticket parlay
    private async Task LogSentryGetTicketsInRequest(int? requestId, IEnumerable<BetId> singleTickets, IEnumerable<BetId> parlayTickets, IEnumerable<BetId> cancelCashOutTickets)
    {
        var stringBuilder = new StringBuilder();
        stringBuilder.AppendLine($"VoidPage-GetTicketsInRequest - {requestId} - {DateTimeOffset.Now:MM/dd/yyyy-HH/mm/ss}");
        stringBuilder.AppendLine("Response:");
        stringBuilder.AppendLine($"*CountTickets - single: {singleTickets.Count()} - parlay: {parlayTickets.Count()} - cancelCO: {cancelCashOutTickets.Count()}");
        stringBuilder.AppendLine($"*singleTickets: {CompressTicket(singleTickets)}");
        stringBuilder.AppendLine($"*parlayTickets: {CompressTicket(parlayTickets)}");
        stringBuilder.AppendLine($"*cancelCashOutTickets: {CompressTicket(cancelCashOutTickets)}");
        await loggingService.InfoAsync(stringBuilder.ToString());
    }

    private async Task LogSentryGetTransInfoJsonForVoid(int? requestId, int? matchId, IEnumerable<string> transInfoJsonList)
    {
        var stringBuilder = new StringBuilder();
        stringBuilder.AppendLine($"VoidPage-GetTransInfoJsonForVoid - {requestId} - {matchId} - {DateTimeOffset.Now:MM/dd/yyyy-HH/mm/ss}");
        stringBuilder.AppendLine("Response:");
        stringBuilder.AppendLine($"{CompressTicket(transInfoJsonList)}");
        await loggingService.InfoAsync(stringBuilder.ToString());
    }

    private async Task LogSentryGetBetTransTicket(int? requestId, int? matchId, IEnumerable<GetTicketModel> tickets)
    {
        var stringBuilder = new StringBuilder();
        stringBuilder.AppendLine($"VoidPage-GetBetTransTicket - {requestId} - {matchId} - {DateTimeOffset.Now:MM/dd/yyyy-HH/mm/ss}");
        stringBuilder.AppendLine("Response:");
        stringBuilder.AppendLine($"{CompressTicket(tickets)}");
        await loggingService.InfoAsync(stringBuilder.ToString());
    }

    private static string CompressTicket<T>(IEnumerable<T>? tickets)
    {
        try
        {
            if (tickets == null || !tickets.Any())
            {
                return string.Empty;
            }
            var ticketZipped = CompressJson(tickets);
            var hexString = $"0x{Convert.ToHexString(ticketZipped)}";
            return hexString;
        }
        catch
        {
            return string.Empty;
        }
    }

    private static byte[] CompressJson<T>(IEnumerable<T> groups)
    {
        var json = JsonSerializer.Serialize(groups);

        var bytes = Encoding.Unicode.GetBytes(json);
        using var memoryStream = new MemoryStream();
        using (var gs = new GZipStream(memoryStream, CompressionMode.Compress))
        {
            gs.Write(bytes, 0, bytes.Length);
        }

        return memoryStream.ToArray();
    }
}