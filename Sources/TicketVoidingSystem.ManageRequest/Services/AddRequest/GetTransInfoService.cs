using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetTransInfoService
{
    Task<IEnumerable<string>> GetTransInfoJson(GetTransInfoQuery query);

    Task<IEnumerable<string>> GetTransInfoJsonForVoid(IEnumerable<BetId> singleTickets, IEnumerable<BetId> parlayTickets, IEnumerable<BetId> cancelCashOutTickets, int? matchId);

    Task<IEnumerable<string>> GetTransInfoJsonForVoid14(IEnumerable<BetId> singleTickets);
}

public class GetTransInfoServiceImp : GetTransInfoService
{
    private readonly IDynamicRepository repository;

    public GetTransInfoServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<string>> GetTransInfoJson(GetTransInfoQuery query)
    {
        var transInfoJsonList = new List<string>();
        var issueInfo = BuildIssueInfo(query);
        foreach (var siteDbGroupId in SiteDbGroupConstant.ServerList.Select(i => i.Id))
        {
            var criteria = CreateGetTicketSiteDbCriteria(siteDbGroupId, issueInfo, query);
            var transInfoJson = await repository.GetAsync<string>(criteria);
            transInfoJsonList.Add(transInfoJson);
        }

        return transInfoJsonList;
    }

    private static GetTicketSiteDbCriteria CreateGetTicketSiteDbCriteria(int siteDbGroupId, string issueInfo, GetTransInfoQuery query)  // NOSONAR
    {
        var criteria = new GetTicketSiteDbCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            IssueTypeId = query.IssueTypeId
        };

        switch (query.IssueTypeId)
        {
            case IssueTypeConstant.AbnormalBet:
            case IssueTypeConstant.AbnormalBetRealMember:
                criteria.AbnormalBetTransIds = issueInfo;
                break;

            case IssueTypeConstant.DangerAccepted:
                criteria.DangerAcceptedInfo = issueInfo;
                break;

            case IssueTypeConstant.RedCard:
                criteria.RedCardInfo = issueInfo;
                break;

            case IssueTypeConstant.WrongKickOffTime:
            case IssueTypeConstant.EarlyKickOffTime:
                criteria.KickOffInfo = issueInfo;
                break;

            case IssueTypeConstant.WrongScore:
                criteria.WrongScoreInfo = issueInfo;
                break;

            case IssueTypeConstant.WrongHDP:
                criteria.WrongHdpInfo = issueInfo;
                break;

            case IssueTypeConstant.Wrong1stHDP:
                criteria.Wrong1stHdpInfo = issueInfo;
                break;

            case IssueTypeConstant.WrongOU:
                criteria.WrongOuInfo = issueInfo;
                break;

            case IssueTypeConstant.Wrong1stOU:
                criteria.Wrong1stOuInfo = issueInfo;
                break;

            case IssueTypeConstant.AbnormalAccount:
                criteria.AbnormalAccounts = issueInfo;
                break;

            case IssueTypeConstant.ArchivedTicket:
                criteria.ArchivedTransIds = issueInfo;
                break;

            case IssueTypeConstant.WrongOdds:
                criteria.WrongOddsInfo = issueInfo;
                break;

            case IssueTypeConstant.ReducedOver:
                criteria.ReducedOverInfo = issueInfo;
                break;

            case IssueTypeConstant.NotParticipate:
                criteria.NotParticipateInfo = issueInfo;
                break;

            case IssueTypeConstant.RecoverTicket:
                criteria.RecoverTicketInfo = issueInfo;
                break;

            default:
                criteria.IssueTypeId = query.IssueTypeId;
                break;
        }

        return criteria;
    }

    public async Task<IEnumerable<string>> GetTransInfoJsonForVoid(IEnumerable<BetId> singleTickets, IEnumerable<BetId> parlayTickets, IEnumerable<BetId> cancelCashOutTickets, int? matchId)
    {
        var transInfoJsonList = new List<string>();
        foreach (var siteDbGroupId in SiteDbGroupConstant.ServerList.Select(i => i.Id))
        {
            var singleTicketsInSite = singleTickets.Where(x => x.SiteDbGroupId == siteDbGroupId);
            var parlayTicketsInSite = parlayTickets.Where(x => x.SiteDbGroupId == siteDbGroupId);
            var cancelCashOutTicketsInSite = cancelCashOutTickets.Where(x => x.SiteDbGroupId == siteDbGroupId);

            var criteria = new GetTransInfoForVoidCriteria
            {
                SiteDbGroupId = siteDbGroupId,
                MatchId = matchId,
                SingleTransIds = Helper.JoinBetIdList(singleTicketsInSite),
                ParlayTransIds = Helper.JoinBetIdList(parlayTicketsInSite),
                CancelCashOutTransIds = Helper.JoinBetIdList(cancelCashOutTicketsInSite)
            };

            var transInfoJson = await repository.GetAsync<string>(criteria);
            transInfoJsonList.Add(transInfoJson);
        }

        return transInfoJsonList;
    }

    public async Task<IEnumerable<string>> GetTransInfoJsonForVoid14(IEnumerable<BetId> singleTickets)
    {
        var transInfoJsonList = new List<string>();
        foreach (var siteDbGroupId in SiteDbGroupConstant.ServerList.Select(i => i.Id))
        {
            var singleTicketsInSite = singleTickets.Where(x => x.SiteDbGroupId == siteDbGroupId);

            var criteria = new GetTransInfoForVoid14Criteria
            {
                SiteDbGroupId = siteDbGroupId,
                SingleTransIds = Helper.JoinBetIdList(singleTicketsInSite)
            };

            var transInfoJson = await repository.GetAsync<string>(criteria);
            transInfoJsonList.Add(transInfoJson);
        }

        return transInfoJsonList;
    }

    private static string BuildIssueInfo(GetTransInfoQuery query) // NOSONAR
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.AbnormalBet or IssueTypeConstant.AbnormalBetRealMember or IssueTypeConstant.ArchivedTicket => query.TransIds,
            IssueTypeConstant.AbnormalAccount => query.AbnormalAccountViewModel.ToAbnormalAccountInfoXml(),
            IssueTypeConstant.EarlyKickOffTime or IssueTypeConstant.WrongKickOffTime => query.EarlyKickOffModels.ToKickOffInfoXml(),
            IssueTypeConstant.WrongScore => query.WrongScoreModels.ToWrongScoreInfoXml(),
            IssueTypeConstant.DangerAccepted => query.DangerAcceptedModels.ToDangerAcceptedInfoXml(),
            IssueTypeConstant.RedCard => query.RedCardModels.ToDangerAcceptedInfoXml(),
            IssueTypeConstant.WrongHDP => query.WrongHdpModels.ToWrongHdpInfoXml(),
            IssueTypeConstant.Wrong1stHDP => query.Wrong1stHdpModels.ToWrongHdpInfoXml(),
            IssueTypeConstant.WrongOU => query.WrongOuModels.ToWrongOuInfoXml(),
            IssueTypeConstant.Wrong1stOU => query.Wrong1stOuModels.ToWrongOuInfoXml(),
            IssueTypeConstant.WrongOdds => query.WrongOddsModels.ToWrongOddsInfoXml(),
            IssueTypeConstant.ReducedOver => query.ReducedOverModels.ToReducedOverInfoXml(),
            IssueTypeConstant.NotParticipate => query.NotParticipateModels.ToNotParticipateInfoXml(),
            IssueTypeConstant.RecoverTicket => query.RecoverTicketModel.ToEventRecoverTicketXml(),
            _ => "",
        };
    }
}