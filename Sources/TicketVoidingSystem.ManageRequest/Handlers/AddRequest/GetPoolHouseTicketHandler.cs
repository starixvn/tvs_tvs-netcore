using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetPoolHouseTicketRequest : GetPoolHouseTicketQuery, IRequest<GetPoolHouseTicketViewModel>
{
}

public class GetPoolHouseTicketHandler : IRequestHandler<GetPoolHouseTicketRequest, GetPoolHouseTicketViewModel>
{
    private readonly IDynamicRepository repository;
    private readonly GetTransInfoService getTransInfoService;
    private readonly GetPoolHouseTicketService getPoolHouseTicketService;
    private readonly IMapper mapper;

    public GetPoolHouseTicketHandler(IDynamicRepository repository, GetPoolHouseTicketService getPoolHouseTicketService,
        GetTransInfoService getTransInfoService, IMapper mapper)
    {
        this.repository = repository;
        this.getTransInfoService = getTransInfoService;
        this.getPoolHouseTicketService = getPoolHouseTicketService;
        this.mapper = mapper;
    }

    public async Task<GetPoolHouseTicketViewModel> Handle(GetPoolHouseTicketRequest request, CancellationToken cancellationToken)
    {
        var criteria = await CreateGetPoolHouseTicketCriteria(request);
        var (betTypes, tickets) = await repository.FetchMultipleAsync<BetTypeModel, GetTicketModel>(criteria, cancellationToken);

        return new GetPoolHouseTicketViewModel
        {
            GroupBetTypes = MappingGroupBetType(betTypes),
            Tickets = getPoolHouseTicketService.GetTicketsViewModel(tickets, request),
            IsAffectedGroup1X2 = request.IsLinkGroup1X2 && CheckAffectedToGroup1X2(request),
            IsAffectedGroup1H1X2 = request.IsLinkGroup1X2 && CheckAffectedToGroup1H1X2(request),
            IsAffectedGroupAIO = request.IsLinkGroupAIO
        };
    }

    private async Task<GetPoolHouseTicketCriteria> CreateGetPoolHouseTicketCriteria(GetPoolHouseTicketQuery message)
    {
        var transInfoJsonList = await GetTransInfoJson(message);
        var criteria = mapper.Map<GetPoolHouseTicketCriteria>(message);
        criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));
        criteria.WrongOddsInfo = message.WrongOddsInfo.ToWrongOddsInfoXml();

        return criteria;
    }

    private static IEnumerable<GroupBetTypeModel> MappingGroupBetType(IEnumerable<BetTypeModel> betTypes)
    {
        return betTypes
            .GroupBy(b => b.GroupName)
            .Select(group => new GroupBetTypeModel { GroupName = group.Key, BetTypes = group.ToList() })
            .OrderBy(gr => gr.GroupName);
    }

    private static bool CheckAffectedToGroup1X2(GetPoolHouseTicketQuery query)
    {
        switch (query.IssueTypeId)
        {
            case IssueTypeConstant.WrongHDP:
            case IssueTypeConstant.WrongOU:
                return true;

            case IssueTypeConstant.WrongOdds:
                return query.SubIssueTypeId == SubIssueTypeConstant.Handicap ||
                       query.SubIssueTypeId == SubIssueTypeConstant.OverUnder;

            default:
                return false;
        }
    }

    private static bool CheckAffectedToGroup1H1X2(GetPoolHouseTicketQuery query)
    {
        switch (query.IssueTypeId)
        {
            case IssueTypeConstant.Wrong1stHDP:
            case IssueTypeConstant.Wrong1stOU:
                return true;

            case IssueTypeConstant.WrongOdds:
                return query.SubIssueTypeId == SubIssueTypeConstant.Wrong1stHDP ||
                       query.SubIssueTypeId == SubIssueTypeConstant.FirstHalfOverUnder;

            default:
                return false;
        }
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(GetPoolHouseTicketQuery query)
    {
        var wrongHdpModels = new List<WrongHdpViewModel>
            {
                new()
                {
                    MatchId = query.MatchId,
                    FilterFromTransTime = query.FilterFromTransTime,
                    FilterToTransTime = query.FilterToTransTime
                }
            };
        var wrongOuModels = new List<WrongOuViewModel>
            {
                new()
                {
                    MatchId = query.MatchId,
                    FilterFromTransTime = query.FilterFromTransTime,
                    FilterToTransTime = query.FilterToTransTime
                }
            };
        var wrongOddsModels = new List<WrongOddsViewModel>
            {
                new()
                {
                    MatchId = query.MatchId,
                    FilterFromTransTime = query.FilterFromTransTime,
                    FilterToTransTime = query.FilterToTransTime
                }
            };
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = query.IssueTypeId,
            WrongHdpModels = query.IssueTypeId == IssueTypeConstant.WrongHDP ? wrongHdpModels : null,
            Wrong1stHdpModels = query.IssueTypeId == IssueTypeConstant.Wrong1stHDP ? wrongHdpModels : null,
            WrongOuModels = query.IssueTypeId == IssueTypeConstant.WrongOU ? wrongOuModels : null,
            Wrong1stOuModels = query.IssueTypeId == IssueTypeConstant.Wrong1stOU ? wrongOuModels : null,
            WrongOddsModels = query.IssueTypeId == IssueTypeConstant.WrongOdds ? wrongOddsModels : null
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}