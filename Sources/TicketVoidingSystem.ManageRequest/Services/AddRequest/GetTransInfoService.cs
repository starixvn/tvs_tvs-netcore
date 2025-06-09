using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetTransInfoService
{
    Task<IEnumerable<string>> GetTransInfoJson(GetTransInfoQuery query);
}

public class GetTransInfoServiceImp(IDynamicRepository repository) : GetTransInfoService
{
    public async Task<IEnumerable<string>> GetTransInfoJson(GetTransInfoQuery query)
    {
        var issueInfo = BuildIssueInfo(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var criteria = CreateGetTicketSiteDbCriteria(server.Id, issueInfo, query);
            return repository.GetAsync<string>(criteria);
        });

        var transInfoJsonInAllServers = await Task.WhenAll(tasks);
        return transInfoJsonInAllServers;
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
            case IssueTypeConstant.Abandoned:
                criteria.ReducedOverInfo = issueInfo;
                break;

            case IssueTypeConstant.NotParticipate:
                criteria.NotParticipateInfo = issueInfo;
                break;

            case IssueTypeConstant.RecoverTicket:
                criteria.RecoverTicketInfo = issueInfo;
                break;

            case IssueTypeConstant.WrongMarketOffered:
                criteria.WrongMarketOfferedInfo = issueInfo;
                break;

            case IssueTypeConstant.TechnicalError:
                criteria.TechnicalErrorInfo = issueInfo;
                break;

            case IssueTypeConstant.WrongOddsSportsBook:
                criteria.WrongOddsSBInfo = issueInfo;
                break;

            case IssueTypeConstant.WrongOfferedName:
                criteria.WrongOfferedNameInfo = issueInfo;
                break;

            case IssueTypeConstant.OtherIssues:
                criteria.OtherIssuesInfo = issueInfo;
                break;

            case IssueTypeConstant.MatchEarlyCompleted:
                criteria.MatchEarlyCompletedInfo = issueInfo;
                break;

            default:
                criteria.IssueTypeId = query.IssueTypeId;
                break;
        }

        return criteria;
    }

    private static string BuildIssueInfo(GetTransInfoQuery query) // NOSONAR
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.ArchivedTicket => query.TransIds,
            IssueTypeConstant.AbnormalBet => query.AbnormalBetModel.TransIds,
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
            IssueTypeConstant.Abandoned => query.ReducedOverModels.ToReducedOverInfoXml(),
            IssueTypeConstant.NotParticipate => query.NotParticipateModels.ToNotParticipateInfoXml(),
            IssueTypeConstant.RecoverTicket => query.RecoverTicketModel.ToEventRecoverTicketXml(),
            IssueTypeConstant.WrongMarketOffered => query.WrongMarketOfferedModels.ToWrongMarketOfferedInfoXml(),
            IssueTypeConstant.TechnicalError => query.TechnicalErrorModel.ToTechnicalErrorInfoXml(),
            IssueTypeConstant.WrongOddsSportsBook => query.WrongOddsSportsBookModels.ToWrongOddsSportsBookInfoXml(),
            IssueTypeConstant.WrongOfferedName => query.WrongOfferedNameModel.ToWrongOfferedNameInfoXml(),
            IssueTypeConstant.OtherIssues => query.OtherIssuesModel.ToOtherIssuesInfoXml(),
            IssueTypeConstant.MatchEarlyCompleted => query.MatchEarlyCompletedModel.ToMatchEarlyCompletedInfoXml(),
            _ => ""
        };
    }
}