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

public class RepositoryImp : Repository
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;

    public RepositoryImp(IMapper mapper, IDynamicRepository repository, SessionService sessionService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
    }

    public async Task<GetTicketsModel> GetVoidTickets(GetVoidTicketsQuery query)
    {
        var tickets = new List<GetTicketModel>();
        var invalidTransIdsAllSiteDb = new List<string>();
        var criteria = CreateGetTicketsCriteria(query);
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var (invalidTransIdsSiteDb, ticketsSiteDb) = await repository.FetchMultipleAsync<string, GetTicketModel>(criteria);
            tickets.AddRange(ticketsSiteDb);
            invalidTransIdsAllSiteDb.AddRange(invalidTransIdsSiteDb);
        }

        return new GetTicketsModel
        {
            InvalidTransIds = Helper.GetIntersectTransIdString(invalidTransIdsAllSiteDb),
            Tickets = tickets.ToList()
        };
    }

    public async Task<(IEnumerable<TicketEmailModel> Tickets, Result Validation)> VoidTickets(VoidTicketsQuery query)
    {
        var emailTicketsAllSiteDb = new List<TicketEmailModel>();
        var validationsAllSiteDb = new List<Result>();
        var criteria = CreateVoidTicketsCriteria(query);
        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            var ticketsInSiteDb = query.Tickets.Where(x => x.SiteDbGroupId == server.Id);
            if (!ticketsInSiteDb.Any())
            {
                continue;
            }

            criteria.SiteDbGroupId = server.Id;
            criteria.TransIds = Helper.JoinBetIdList(ticketsInSiteDb);
            var (validationSiteDb, emailTicketsSiteDb) = await repository.FetchMultipleAsync<Result, TicketEmailModel>(criteria);
            emailTicketsAllSiteDb.AddRange(emailTicketsSiteDb);
            validationsAllSiteDb.AddRange(validationSiteDb);
        }

        return BuildVoidTickets(emailTicketsAllSiteDb, validationsAllSiteDb);
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