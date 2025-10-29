using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Criteria.JackTimeHybridParlay;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.JackTimeHybridParlay;

namespace TicketVoidingSystem.Services.JackTimeHybridParlay;

public interface HybridParlayTicketService
{
    Task<bool> Execute(IEnumerable<BetId> hybridParlayBetIds, bool isVoid);
}

public class HybridParlayTicketServiceImp(JackTimeHybridParlayService jackTimeHybridParlayService, OnlineServerRepository.OnlineServerRepository onlineServerRepository, LoggingService loggingService)
    : HybridParlayTicketService
{
    public async Task<bool> Execute(IEnumerable<BetId> hybridParlayTickets, bool isVoid)
    {
        try
        {
            if (!hybridParlayTickets.Any())
            {
                return false;
            }

            var hybridParlayTransIds = string.Join(",", hybridParlayTickets.Select(x => x.TransId));
            var ticketsDetail = await GetTicketsDetail(hybridParlayTransIds);
            var request = CreateRequest(ticketsDetail);
            return await jackTimeHybridParlayService.Execute(request, isVoid);
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync($"{nameof(HybridParlayTicketService)}.{nameof(Execute)} Error", e);
            return false;
        }
    }

    public async Task<IEnumerable<HybridParlayTicketModel>> GetTicketsDetail(string transIds)
    {
        var criteria = new HybridParlayTicketCriteria
        {
            TransIds = transIds
        };

        return await onlineServerRepository.FetchAsync<HybridParlayTicketModel>(criteria);
    }

    private static HybridParlayApiModel CreateRequest(IEnumerable<HybridParlayTicketModel> ticketsDetail)
    {
        var voidBetInfos = ticketsDetail.GroupBy(ticket => ticket.MainTransId).Select(group => new HybridParlayVoidBetInfo
        {
            Bet = { TransId = group.Key },
            Legs = group.Select(item => new LegModel
            {
                Way = { Id = item.SubBetTeam },
                Market = { MatchId = item.SubMatchId, MarketId = $"{item.SubMatchId}_{item.SubBetTypeId}_{item.SubHdp1}" }
            })
        });

        return new HybridParlayApiModel
        {
            VoidBetInfos = voidBetInfos
        };
    }
}