using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.ViewModels;

namespace TicketVoidingSystem.TicketListing.Services;

public interface GetSummaryTicketsService
{
    Task<GetSummaryViewModel> GetSummaryTickets(GetSummaryQuery query);
}

public class GetSummaryTicketsServiceImp : GetSummaryTicketsService
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly AffectTicketsFromSettlementHistoryService affectTicketsFromSettlementHistoryService;
    private readonly BetListService betListService;

    public GetSummaryTicketsServiceImp(IMapper mapper, IDynamicRepository repository,
        AffectTicketsFromSettlementHistoryService affectTicketsFromSettlementHistoryService, BetListService betListService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.affectTicketsFromSettlementHistoryService = affectTicketsFromSettlementHistoryService;
        this.betListService = betListService;
    }

    public async Task<GetSummaryViewModel> GetSummaryTickets(GetSummaryQuery query)
    {
        var criteria = mapper.Map<GetSummaryCriteria>(query);
        criteria.FromTransDate = query.FromTransDate.ZoneCanada();
        criteria.ToTransDate = query.ToTransDate.ZoneCanada();
        criteria.LiveType = query.EventType;
        criteria.SecondAcceptFlag = query.TicketType;
        criteria.Type = query.Product;
        criteria.BetTeams = query.BetTeams.ToBetTypeXml();
        criteria.AffectTickets = await affectTicketsFromSettlementHistoryService.GetTickets(query.IsReSettled, query.MatchId);
        var model = await repository.FetchAsync<SummaryTicketModel>(criteria);
        var viewModel = new GetSummaryViewModel();
        if (model == null)
        {
            return viewModel;
        }

        UpdateBetTypeName(model);
        viewModel.GroupByBetTypes = GroupTicketsByBetTypes(model, query);
        viewModel.GroupByLicensees = GroupTicketsByLicensees(model, query);

        return viewModel;
    }

    private void UpdateBetTypeName(IEnumerable<SummaryTicketModel> tickets)
    {
        foreach (var ticket in tickets)
        {
            ticket.BetTypeName = betListService.GetBetTypeName(ticket.BetTypeId, ticket.RefNo);
        }
    }

    private static IEnumerable<SummaryViewModel> GroupTicketsByLicensees(IEnumerable<SummaryTicketModel> tickets, GetSummaryQuery query)
    {
        return tickets.GroupBy(t => t.LicenseeName)
            .Select(view => new SummaryViewModel
            {
                Name = view.First().LicenseeName,
                LicenseeName = view.First().LicenseeName,
                Total = view.Sum(total => total.TotalTrans),
                Items = view.Select(item => new SummaryItem
                {
                    BetTypes = item.BetTypeId.ToString(),
                    LicenseeName = item.LicenseeName,
                    Name = item.BetTypeName,
                    Total = item.TotalTrans
                }).ToList(),
                BetTypes = query.BetTypes,
                IsChinaView = view.First().IsChinaView
            });
    }

    private static IEnumerable<SummaryViewModel> GroupTicketsByBetTypes(IEnumerable<SummaryTicketModel> tickets, GetSummaryQuery query)
    {
        return tickets.GroupBy(t => t.BetTypeName)
            .Select(view => new SummaryViewModel
            {
                Name = view.First().BetTypeName,
                LicenseeName = query.LicenseeId == 0 ? "All" : view.First().LicenseeName,
                Total = view.Sum(total => total.TotalTrans),
                Items = view.Select(item => new SummaryItem
                {
                    BetTypes = item.BetTypeId.ToString(),
                    LicenseeName = item.LicenseeName,
                    Name = item.LicenseeName,
                    Total = item.TotalTrans
                }).ToList(),
                BetTypes = view.First().BetTypeId.ToString()
            });
    }
}