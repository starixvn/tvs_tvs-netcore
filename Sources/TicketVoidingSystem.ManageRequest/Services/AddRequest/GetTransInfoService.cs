using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
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

    public async Task<IEnumerable<string>> GetTransInfoJson(GetTransInfoQuery query) // NOSONAR
    {
        var transInfoJsonList = new List<string>();
        var issueInfo = BuildIssueInfo(query);
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            var criteria = new GetTicketSiteDbCriteria
            {
                SiteDbGroupId = item.Id,
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

                default:
                    criteria.IssueTypeId = query.IssueTypeId;
                    break;
            }

            var transInfoJson = await repository.GetAsync<string>(criteria);
            transInfoJsonList.Add(transInfoJson);
        }

        return transInfoJsonList;
    }

    public async Task<IEnumerable<string>> GetTransInfoJsonForVoid(IEnumerable<BetId> singleTickets, IEnumerable<BetId> parlayTickets, IEnumerable<BetId> cancelCashOutTickets, int? matchId)
    {
        var transInfoJsonList = new List<string>();
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            var singleTicketsInSite = singleTickets.Where(x => x.SiteDbGroupId == item.Id);
            var parlayTicketsInSite = parlayTickets.Where(x => x.SiteDbGroupId == item.Id);
            var cancelCashOutTicketsInSite = cancelCashOutTickets.Where(x => x.SiteDbGroupId == item.Id);

            var criteria = new GetTransInfoForVoidCriteria
            {
                SiteDbGroupId = item.Id,
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
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            var singleTicketsInSite = singleTickets.Where(x => x.SiteDbGroupId == item.Id);

            var criteria = new GetTransInfoForVoid14Criteria
            {
                SiteDbGroupId = item.Id,
                SingleTransIds = Helper.JoinBetIdList(singleTicketsInSite),
            };

            var transInfoJson = await repository.GetAsync<string>(criteria);
            transInfoJsonList.Add(transInfoJson);
        }

        return transInfoJsonList;
    }

    private static string BuildIssueInfo(GetTransInfoQuery query) // NOSONAR
    {
        switch (query.IssueTypeId)
        {
            case IssueTypeConstant.AbnormalBet:
            case IssueTypeConstant.AbnormalBetRealMember:
            case IssueTypeConstant.ArchivedTicket:
                return query.TransIds;

            case IssueTypeConstant.AbnormalAccount:
                return ObjectToXMLExtension.GetAbnormalAccountInfoXml(query.Usernames, query.ProductIds, query.StatusIds, query.FromDate, query.ToDate);

            case IssueTypeConstant.EarlyKickOffTime:
            case IssueTypeConstant.WrongKickOffTime:
                return ObjectToXMLExtension.GetKickOffInfoXml(query.MatchId, query.KickOffTime.ZoneCanada());

            case IssueTypeConstant.WrongScore:
                return query.WrongScoreModels.ToWrongScoreInfoXml();

            case IssueTypeConstant.DangerAccepted:
                return query.DangerAcceptedModels.ToDangerAcceptedInfoXml();

            case IssueTypeConstant.RedCard:
                return query.RedCardModels.ToDangerAcceptedInfoXml();

            case IssueTypeConstant.WrongHDP:
                return query.WrongHdpModels.ToWrongHdpInfoXml();

            case IssueTypeConstant.Wrong1stHDP:
                return query.Wrong1stHdpModels.ToWrongHdpInfoXml();

            case IssueTypeConstant.WrongOU:
                return query.WrongOuModels.ToWrongOuInfoXml();

            case IssueTypeConstant.Wrong1stOU:
                return query.Wrong1stOuModels.ToWrongOuInfoXml();

            case IssueTypeConstant.WrongOdds:
                return query.WrongOddsModels.ToWrongOddsInfoXml();

            default:
                return "";
        }
    }
}