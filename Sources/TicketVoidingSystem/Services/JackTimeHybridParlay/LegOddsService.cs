using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.Logging;
using Polly;
using TicketVoidingSystem.Criteria.JackTimeHybridParlay;
using TicketVoidingSystem.Models.JackTimeHybridParlay;

namespace TicketVoidingSystem.Services.JackTimeHybridParlay;

public interface LegOddsService
{
    Task<bool> Execute(int matchId, DateTime logDate, int siteDbGroupId, IEnumerable<LegOddsModel> ticketsWaitToUpdateOdds);
}

public class LegOddsServiceImp(
    IDynamicRepository repository,
    LoggingService loggingService,
    SessionService sessionService)
    : LegOddsService
{
    public async Task<bool> Execute(int matchId, DateTime logDate, int siteDbGroupId, IEnumerable<LegOddsModel> ticketsWaitToUpdateOdds)
    {
        try
        {
            var legOdds = await RetryForGetLegOdds(matchId, logDate, ticketsWaitToUpdateOdds);
            if (legOdds.Any())
            {
                return await UpdateLegOdds(legOdds, siteDbGroupId);
            }

            return false;
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e.Message, e);

            return false;
        }
    }

    public async Task<IEnumerable<LegOddsModel>> RetryForGetLegOdds(int matchId, DateTime logDate, IEnumerable<LegOddsModel> ticketsWaitToUpdateOdds)
    {
        const byte retryCount = 10;
        const byte retryTimes = 3;
        var legOdds = Enumerable.Empty<LegOddsModel>();
        var expectedTransIds = ticketsWaitToUpdateOdds.Select(t => t.TransId).Distinct().ToHashSet();
        await Policy
            .HandleResult<bool>(success => !success)
            .WaitAndRetryAsync(retryCount,
                _ => TimeSpan.FromSeconds(retryTimes))
            .ExecuteAsync(async () =>
            {
                legOdds = await GetLegOdds(matchId, logDate, ticketsWaitToUpdateOdds);

                var receivedTransIds = legOdds
                    .Select(o => o.TransId)
                    .Distinct()
                    .ToHashSet();

                var allMatched = expectedTransIds.All(id => receivedTransIds.Contains(id));
                return allMatched;
            });

        return legOdds;
    }

    public async Task<IEnumerable<LegOddsModel>> GetLegOdds(int matchId, DateTime logDate, IEnumerable<LegOddsModel> ticketsWaitToUpdateOdds)
    {
        var criteria = new HybridParlayGetLegOddsCriteria
        {
            MatchId = matchId,
            TransIds = string.Join(",", ticketsWaitToUpdateOdds.Select(x => x.TransId)),
            LogDate = logDate
        };
        await LogService.InfoAsync("Retry for get odds:" + JsonSerializer.Serialize(criteria));

        return await repository.FetchAsync<LegOddsModel>(criteria);
    }

    public async Task<bool> UpdateLegOdds(IEnumerable<LegOddsModel> legOdds, int siteDbGroupId)
    {
        var jsonLegOdds = JsonSerializer.Serialize(legOdds);
        var criteria = new HybridParlayUpdateLegOddsCriteria
        {
            LegOddsJson = jsonLegOdds,
            MatchId = legOdds.First().MatchId,
            Creator = sessionService.UserId,
            SiteDbGroupId = siteDbGroupId
        };

        await repository.ExecuteAsync(criteria);
        await loggingService.InfoAsync($"Update leg odds: {jsonLegOdds} \nErrorCode: {criteria.ErrCode} \nErrMsg: {criteria.ErrMsg}");

        return criteria.ErrCode == 0 || string.IsNullOrWhiteSpace(criteria.ErrMsg);
    }
}