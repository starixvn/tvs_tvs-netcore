using AutoMapper;
using Fanex.Data.Repository;
using SpecialDelete.NumberGame.Criteria;
using SpecialDelete.NumberGame.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.NumberGame.Repositories;

public interface Repository
{
    Task<GetTicketsModel> GetVoidTickets(GetVoidTicketsQuery query);

    Task<(IEnumerable<TicketEmailModel> Tickets, Result Validation)> VoidTickets(VoidTicketsQuery query);
}

public class RepositoryImp(IMapper mapper, IDynamicRepository repository, SessionService sessionService)
    : Repository
{
    public async Task<GetTicketsModel> GetVoidTickets(GetVoidTicketsQuery query)
    {
        var criteria = CreateGetTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<string, GetTicketModel>(criteria);
        });
        (IEnumerable<string> InvalidTransId, IEnumerable<GetTicketModel> Tickets)[] results = await Task.WhenAll(tasks);
        var invalidTransIdsInAllServers = results.SelectMany(x => x.InvalidTransId);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return new GetTicketsModel
        {
            InvalidTransIds = Helper.GetIntersectTransIdString(invalidTransIdsInAllServers),
            Tickets = ticketsInAllServers.ToList()
        };
    }

    public async Task<(IEnumerable<TicketEmailModel> Tickets, Result Validation)> VoidTickets(VoidTicketsQuery query)
    {
        var criteria = CreateVoidTicketsCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInSiteDb = query.Tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                return Task.FromResult((Enumerable.Empty<Result>(), Enumerable.Empty<TicketEmailModel>()));
            }

            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<Result, TicketEmailModel>(criteria);
        });

        (IEnumerable<Result> Validation, IEnumerable<TicketEmailModel> Tickets)[] results = await Task.WhenAll(tasks);
        var validationInAllServers = results.SelectMany(x => x.Validation);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);

        return BuildVoidTickets(ticketsInAllServers, validationInAllServers);
    }

    private GetVoidTicketsCriteria CreateGetTicketsCriteria(GetVoidTicketsQuery query)
    {
        var criteria = mapper.Map<GetVoidTicketsCriteria>(query);
        criteria.FromTransDate = query.FromTransDate.ZoneCanada();
        criteria.ToTransDate = query.ToTransDate.ZoneCanada();

        return criteria;
    }

    private VoidTicketsCriteria CreateVoidTicketsCriteria(VoidTicketsQuery query)
    {
        var criteria = mapper.Map<VoidTicketsCriteria>(query);
        criteria.FromTransDate = query.FromTransDate.ZoneCanada();
        criteria.ToTransDate = query.ToTransDate.ZoneCanada();
        criteria.UserId = sessionService.UserId;
        criteria.Ip = sessionService.GetClientIp();

        return criteria;
    }

    private static (IEnumerable<TicketEmailModel> Tickets, Result Validation) BuildVoidTickets(IEnumerable<TicketEmailModel> tickets, IEnumerable<Result> validations)
    {
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var validation = new Result
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty
        };

        return (tickets, validation);
    }
}