using AutoMapper;
using Fanex.Data.Repository;
using SpecialDelete.VoidByBetId.Criteria;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeHybridParlay;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VoidByBetId.Repositories;

public interface VoidByBetIdRepository
{
    Task<(IEnumerable<GetTicketModel> Tickets, string InvalidTransIds, string MovedTransIds, int MatchId)> GetTickets(GetTicketsQuery query);

    Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query);
}

public class VoidByBetIdRepositoryImp(
    IMapper mapper,
    IDynamicRepository repository,
    SessionService sessionService,
    HybridParlayTicketService hybridParlayTicketService)
    : VoidByBetIdRepository
{
    public async Task<(IEnumerable<GetTicketModel> Tickets, string InvalidTransIds, string MovedTransIds, int MatchId)> GetTickets(GetTicketsQuery query)
    {
        var criteria = mapper.Map<GetTicketsCriteria>(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(criteria);
        });
        (IEnumerable<GetTicketValidation> Validation, IEnumerable<GetTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResultGetTickets(ticketsInAllServers, validationInAllServers);
    }

    public async Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query)
    {
        var criteria = CreateVoidTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = query.Tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                return Task.FromResult((Enumerable.Empty<VoidTicketValidation>(), Enumerable.Empty<TicketEmailModel>()));
            }
            hybridParlayTicketService.Execute(ticketsInSiteDb.Where(t => t.IsHybrid), HybridParlayType.VoidMain, HybridParlayTicketType.Main, server.Id);

            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(criteria);
        });

        (IEnumerable<VoidTicketValidation> Validation, IEnumerable<TicketEmailModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildResultVoidTickets(validationInAllServers, ticketsInAllServers, query);
    }

    private static VoidTicketsModel BuildResultVoidTickets(IEnumerable<VoidTicketValidation> validations, IEnumerable<TicketEmailModel> emailTickets, VoidTicketsQuery query)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var combineValidation = new VoidTicketValidation
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty
        };
        var siteDbHasError = validations.Where(x => !x.IsSuccessful).Select(x => x.SiteDbGroupId);
        var ticketsRollbackNetPosition = query.TransIdCrickets?.Where(x => siteDbHasError.Any(siteId => siteId == x.SiteDbGroupId));

        return new VoidTicketsModel
        {
            Tickets = emailTickets,
            Validation = combineValidation,
            TicketsRollbackNetPosition = ticketsRollbackNetPosition
        };
    }

    private static (IEnumerable<GetTicketModel> Tickets, string InvalidTransIds, string MovedTransIds, int MatchId) BuildResultGetTickets(IEnumerable<GetTicketModel> tickets
        , IEnumerable<GetTicketValidation> validations)
    {
        var invalidTransIds = Helper.GetIntersectTransIdString(validations.Select(y => y.InvalidTransIds));
        var movedTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.MovedTransIds));
        var validMatchIdI = GetMatchId(validations);
        return (tickets, invalidTransIds, movedTransIds, validMatchIdI);
    }

    private static int GetMatchId(IEnumerable<GetTicketValidation> validations)
    {
        var matchIds = validations.Where(x => x.MatchId != null).Select(x => x.MatchId).Distinct();
        if (matchIds.Contains(0))
        {
            return 0;
        }
        return (int)(matchIds.Count() == 1 ? matchIds.First() : 0)!;
    }

    private VoidTicketsCriteria CreateVoidTicketsCriteria(VoidTicketsQuery query)
    {
        return new VoidTicketsCriteria
        {
            UserId = sessionService.UserId,
            Username = query.Username,
            Password = query.Password,
            Reason = query.Reason,
            ReasonSC = query.ReasonSC,
            Ip = sessionService.GetClientIp(),
            AbnormalBetType = query.AbnormalBetType
        };
    }
}