using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.Logging;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.JackTimeHybridParlay;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.JackTimeHybridParlay;

namespace TicketVoidingSystem.Services.JackTimeHybridParlay;

public interface HybridParlayTicketService
{
    Task<bool> Execute(IEnumerable<BetId> hybridParlayTickets, HybridParlayType type, int ticketType, int siteDbGroupId);
}

public class HybridParlayTicketServiceImp(
    JackTimeHybridParlayService jackTimeHybridParlayService,
    IDynamicRepository dynamicRepository,
    LoggingService loggingService,
    LegOddsService legOddsService)
    : HybridParlayTicketService
{
    public async Task<bool> Execute(IEnumerable<BetId> hybridParlayTickets, HybridParlayType type, int ticketType, int siteDbGroupId)
    {
        try
        {
            //:: TODO: Remove this clearly Recover main ticket flow JackTime
            if (type is HybridParlayType.RecoverMain)
            {
                return true;
            }
            //:: TODO: Remove this clearly Recover main ticket flow JackTime

            if (!hybridParlayTickets.Any())
            {
                return true;
            }

            var hybridParlayTransIds = string.Join(",", hybridParlayTickets.Select(x => x.TransId));
            var ticketsDetail = (await GetTicketsDetail(hybridParlayTransIds, ticketType, siteDbGroupId)).ToList();
            var request = CreateRequest(ticketsDetail, ticketType);
            var logDate = DateTimeOffset.Now.DateTime;

            var isCalled = await jackTimeHybridParlayService.Execute(request, type);
            if (IsNotUpdateLegOdds(type))
            {
                return true; // No need to call leg odds service for voiding or recovering main bets & don't care status call JackTime
            }

            if (isCalled)
            {
                await LogService.InfoAsync("List tickets: " + JsonSerializer.Serialize(ticketsDetail));
                var matchId = ticketsDetail[0].SubMatchId;
                var mainTransIds = string.Join(",", ticketsDetail.Select(x => x.MainTransId));
                var result = await legOddsService.Execute(matchId, mainTransIds, logDate, siteDbGroupId);

                return result;
            }

            return false;
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync($"{nameof(HybridParlayTicketService)}.{nameof(Execute)} Error", e);
            return IsNotUpdateLegOdds(type);
        }
    }

    public async Task<IEnumerable<HybridParlayTicketModel>> GetTicketsDetail(string transIds, int ticketType, int siteDbGroupId)
    {
        var criteria = new HybridParlayTicketCriteria
        {
            TransIds = transIds,
            TicketType = ticketType,
            SiteDbGroupId = siteDbGroupId
        };

        return await dynamicRepository.FetchAsync<HybridParlayTicketModel>(criteria);
    }

    private static HybridParlayApiModel CreateRequest(IEnumerable<HybridParlayTicketModel> ticketsDetail, int ticketType)
    {
        return ticketType is HybridParlayTicketType.Main
            ? CreateRequestMainTicket(ticketsDetail)
            : CreateRequestSubTicket(ticketsDetail);
    }

    private static HybridParlayApiModel CreateRequestMainTicket(IEnumerable<HybridParlayTicketModel> ticketsDetail)
    {
        var voidBetInfos = ticketsDetail.Select(ticket => new HybridParlayVoidBetInfo
        {
            TransactionId = GetTransactionId(ticket.Transdesc),
            TransId = ticket.MainTransId,
            CustId = ticket.CustId,
        });

        return new HybridParlayApiModel
        {
            VoidBetInfos = voidBetInfos
        };
    }

    private static HybridParlayApiModel CreateRequestSubTicket(IEnumerable<HybridParlayTicketModel> ticketsDetail)
    {
        var groups = ticketsDetail.GroupBy(ticket => ticket.MainTransId);
        var voidBetInfos = groups.Select(group =>
        {
            var firstItem = group.First();

            return new HybridParlayVoidBetInfo
            {
                TransactionId = GetTransactionId(firstItem.Transdesc),
                TransId = firstItem.MainTransId,
                CustId = firstItem.CustId,
                MatchId = "",
                Selections = group.Select(CreateLegModel)
            };
        });

        return new HybridParlayApiModel
        {
            VoidBetInfos = voidBetInfos
        };
    }

    private static LegModel CreateLegModel(HybridParlayTicketModel item)
    {
        var quarter = GetQuarter(item.SubBetCheck);
        var hdp = GetHdp(item.SubHdp1, item.SubHdp2, item.SubBetTypeId);
        return new LegModel
        {
            WayId = GetWayId(item.SubBetTeam),
            MatchId = item.SubMatchId,
            MarketId = $"{item.SubMatchId}_{item.SubBetTypeId}_{quarter}_{hdp}"
        };
    }

    private static bool IsNotUpdateLegOdds(HybridParlayType type)
    {
        return type is HybridParlayType.VoidMain or HybridParlayType.RecoverMain;
    }

    private static string GetTransactionId(string transdesc)
    {
        using var doc = JsonDocument.Parse(transdesc);
        return doc.RootElement.GetProperty("id").GetString();
    }

    private static string GetHdp(decimal hdp1, decimal hdp2, int betType)
    {
        List<int> betTypesHandicap = [1, 7, 20, 21, 609, 612];
        var value = betTypesHandicap.Contains(betType) ? hdp2 - hdp1 : hdp1;

        return value.ToString("G29", CultureInfo.InvariantCulture);
    }

    private static string GetWayId(string betTeam)
    {
        List<string> betTeamsWay1 = ["h", "a"];
        return betTeamsWay1.Contains(betTeam.ToLower()) ? "way1" : "way2";
    }

    private static string GetQuarter(string betCheck)
    {
        if (string.IsNullOrWhiteSpace(betCheck) || betCheck.Length < 2)
        {
            return "0";
        }
        return betCheck[^2..];
    }
}