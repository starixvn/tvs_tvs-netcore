using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Polly;
using TicketVoidingSystem.Criteria.JackTimeHybridParlay;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.JackTimeHybridParlay;

namespace TicketVoidingSystem.Services.JackTimeHybridParlay;

public interface LegOddsService
{
    Task<bool> Execute(int matchId, string mainTransId, DateTime triggerTime);
}

public class LegOddsServiceImp(DynamicRepository repository, LoggingService loggingService)
    : LegOddsService
{
    public async Task<bool> Execute(int matchId, string transIds, DateTime LogDate)
    {
        try
        {
            var legOdds = await RetryForGetLegOdds(matchId, transIds, LogDate);
            if (legOdds.Any())
            {
                return true;
            }

            return false;
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e.Message, e);
            return false;
        }
    }

    public async Task<IEnumerable<LegOddsModel>> RetryForGetLegOdds(int matchId, string transIds, DateTime LogDate)
    {
        const byte retryCount = 12;
        const byte retryTimes = 10;
        await Policy
            .HandleResult<bool>(c => !c)
            .WaitAndRetryAsync(retryCount,
                _ => TimeSpan.FromSeconds(retryTimes))
            .ExecuteAsync(async () =>
            {
                var legOdds = await GetLegOdds(matchId, transIds, LogDate);

                return legOdds.Any();
            });

        return [];
    }

    public async Task<IEnumerable<LegOddsModel>> GetLegOdds(int matchId, string transIds, DateTime LogDate)
    {
        var criteria = new HybridParlayGetLegOddsCriteria
        {
            MatchId = matchId,
            TransIds = transIds,
            LogDate = LogDate
        };

        return await repository.FetchAsync<LegOddsModel>(criteria);
    }

    public async Task<Result> UpdateLegOdds(int matchId, string transIds, DateTime LogDate)
    {
        var criteria = new HybridParlayUpdateLegOddsCriteria
        {
            LegOddsJson = ""
        };

        return await repository.GetAsync<Result>(criteria);
    }
}