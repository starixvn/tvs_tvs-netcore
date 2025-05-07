using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

public interface LogInfoService
{
    Task<GetLogInfoViewModel> Get(GetLogInfoQuery query);
}

public class LogInfoServiceImp(
    IMapper mapper,
    IDynamicRepository repository,
    SessionService session,
    BetListService betListService,
    CopyRequestInfoService copyRequestInfoService) : LogInfoService
{
    public async Task<GetLogInfoViewModel> Get(GetLogInfoQuery query)
    {
        var logInfoAllServers = await GetLogInfoAllServer(query);
        var logInfoModels = await GetLogInfoModels(query, logInfoAllServers.Validations, logInfoAllServers.TicketRequests, logInfoAllServers.LogInfoDetails, logInfoAllServers.BetTypeTickets);
        return new GetLogInfoViewModel
        {
            GetLogInfoModels = logInfoModels,
            TransInfoAddRequestModel = LogInfoHelper.CombineTransInfoAddRequest(logInfoAllServers.TransInfoAddRequests)
        };
    }

    public async Task<LogInfoResult> GetLogInfoAllServer(GetLogInfoQuery query)
    {
        var criteria = GetLogInfoCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<Validation, TicketRequest, LogInfoDetail, TransInfoAddRequestModel, BetTypeTicketsInfo>(criteria);
        });
        var results = await Task.WhenAll(tasks);

        return new LogInfoResult
        {
            Validations = results.SelectMany(x => x.Item1),
            TicketRequests = results.SelectMany(x => x.Item2),
            LogInfoDetails = results.SelectMany(x => x.Item3),
            TransInfoAddRequests = results.SelectMany(x => x.Item4),
            BetTypeTickets = LogInfoHelper.CombineBetTypes(results.SelectMany(x => x.Item5))
        };
    }

    private async Task<List<GetLogInfoModel>> GetLogInfoModels(GetLogInfoQuery query, IEnumerable<Validation> validations, // NOSONAR
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails, IEnumerable<BetTypeTicketsInfo> betTypeCount)
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.WrongScore => GetLogInfoViewModelWrongScore(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.DangerAccepted => GetLogInfoViewModelDangerAccepted(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.RedCard => GetLogInfoViewModelRedCard(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.WrongHDP => GetLogInfoViewModelWrongHdp(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.Wrong1stHDP => GetLogInfoViewModelWrong1stHdp(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.WrongOU => GetLogInfoViewModelWrongOu(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.Wrong1stOU => GetLogInfoViewModelWrong1stOu(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.WrongOdds => GetLogInfoViewModelWrongOdds(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.WrongOddsSportsBook => GetLogInfoViewModelWrongOddsSportsBook(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.ReducedOver => GetLogInfoViewModelReducedOver(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.Abandoned => GetLogInfoViewModelReducedOver(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.NotParticipate => GetLogInfoViewModelNotParticipate(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.EarlyKickOffTime => GetLogInfoViewModelEarlyKickOff(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.WrongKickOffTime => GetLogInfoViewModelEarlyKickOff(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.WrongMarketOffered => await GetLogInfoViewModelWrongMarketOffered(query, validations, ticketRequests, logInfoDetails, betTypeCount),
            IssueTypeConstant.TechnicalError => await GetLogInfoViewModelTechnicalError(query, validations, ticketRequests, logInfoDetails, betTypeCount),
            IssueTypeConstant.WrongOfferedName => GetLogInfoViewModelWrongOfferedName(query, validations, ticketRequests, logInfoDetails),
            IssueTypeConstant.OtherIssues => GetLogInfoViewModelOtherIssues(query, validations, ticketRequests, logInfoDetails),
            _ => GetLogInfoViewModelDefault(validations, ticketRequests, logInfoDetails)
        };
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelWrongScore(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.WrongScoreModels.Select(item => new GetLogInfoModel
        {
            ScoreId = item.ScoreId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.ScoreId == item.ScoreId && x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.ScoreId == item.ScoreId && x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.ScoreId == item.ScoreId && x.MatchId == item.MatchId),
            MatchId = item.MatchId
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelDangerAccepted(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.DangerAcceptedModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelRedCard(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.RedCardModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelWrongHdp(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.WrongHdpModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelWrong1stHdp(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.Wrong1stHdpModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelWrongOu(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.WrongOuModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelWrong1stOu(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.Wrong1stOuModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelWrongOdds(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.WrongOddsModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelReducedOver(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.ReducedOverModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelNotParticipate(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.NotParticipateModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelEarlyKickOff(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return query.EarlyKickOffModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.MatchId == item.MatchId),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.MatchId == item.MatchId),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.MatchId == item.MatchId)
        }).ToList();
    }

    private async Task<List<GetLogInfoModel>> GetLogInfoViewModelWrongMarketOffered(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails, IEnumerable<BetTypeTicketsInfo> betTypeCount)
    {
        var preparedBetTypeCount = await UpdateBetTypeTicketsInfo(query.WrongMarketOfferedModels.First().MatchId, betTypeCount);

        return query.WrongMarketOfferedModels.Select((item, index) => new GetLogInfoModel
        {
            Id = index + 1,
            MatchId = query.WrongMarketOfferedModels.First().MatchId,
            Validation = LogInfoHelper.CombineValidations(validations, x => x.Id == item.Id),
            TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => x.Id == item.Id),
            LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => x.Id == item.Id),
            BetTypeCount = preparedBetTypeCount.Where(x => x.Id == item.Id)
                .OrderBy(x => x.OriginalBetTypeName)
                .ThenBy(x => x.BetId)
        }).ToList();
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelWrongOddsSportsBook(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return
        [
            new GetLogInfoModel
            {
                MatchId = query.WrongOddsSportsBookModel.MatchId,
                Validation = LogInfoHelper.CombineValidations(validations, x => true),
                TicketRequest = ticketRequests,
                LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => true)
            }
        ];
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelWrongOfferedName(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return
        [
            new GetLogInfoModel
            {
                MatchId = query.WrongOfferedNameModel.MatchId,
                Validation = LogInfoHelper.CombineValidations(validations, x => true),
                TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => true),
                LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => true)
            }
        ];
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelOtherIssues(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return
        [
            new GetLogInfoModel
            {
                MatchId = query.OtherIssuesModel.MatchId,
                Validation = LogInfoHelper.CombineValidations(validations, x => true),
                TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => true),
                LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => true),
            }
        ];
    }

    private async Task<List<GetLogInfoModel>> GetLogInfoViewModelTechnicalError(GetLogInfoQuery query, IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails, IEnumerable<BetTypeTicketsInfo> betTypeCount)
    {
        var preparedBetTypeCount = await UpdateBetTypeTicketsInfo(query.TechnicalErrorModel.MatchId, betTypeCount);
        return
        [
            new GetLogInfoModel
            {
                MatchId = query.TechnicalErrorModel.MatchId,
                Validation = LogInfoHelper.CombineValidations(validations, x => true),
                TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => true),
                LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => true),
                BetTypeCount = preparedBetTypeCount.OrderBy(x => x.OriginalBetTypeName).ThenBy(x => x.BetId)
            }
        ];
    }

    private static List<GetLogInfoModel> GetLogInfoViewModelDefault(IEnumerable<Validation> validations,
        IEnumerable<TicketRequest> ticketRequests, IEnumerable<LogInfoDetail> logInfoDetails)
    {
        return
        [
            new GetLogInfoModel
            {
                Validation = LogInfoHelper.CombineValidations(validations, x => true),
                TicketRequest = LogInfoHelper.CombineTicketRequest(ticketRequests, x => true),
                LogInfoDetail = LogInfoHelper.CombineLogInfoDetail(logInfoDetails, x => true)
            }
        ];
    }

    private GetLogInfoCriteria GetLogInfoCriteria(GetLogInfoQuery query) //NOSONAR
    {
        var criteria = mapper.Map<GetLogInfoCriteria>(query);
        criteria.UserId = session.UserId;
        criteria.KickOffInfo = query.EarlyKickOffModels?.ToKickOffInfoXml();
        criteria.WrongScoreInfo = query.WrongScoreModels?.ToWrongScoreInfoXml();
        criteria.DangerAcceptedInfo = query.DangerAcceptedModels?.ToDangerAcceptedInfoXml();
        criteria.RedCardInfo = query.RedCardModels?.ToDangerAcceptedInfoXml();
        criteria.WrongHdpInfo = query.WrongHdpModels?.ToWrongHdpInfoXml();
        criteria.Wrong1stHdpInfo = query.Wrong1stHdpModels?.ToWrongHdpInfoXml();
        criteria.WrongOuInfo = query.WrongOuModels?.ToWrongOuInfoXml();
        criteria.Wrong1stOuInfo = query.Wrong1stOuModels?.ToWrongOuInfoXml();
        criteria.WrongOddsInfo = query.WrongOddsModels?.ToWrongOddsInfoXml();
        criteria.WrongOddsSBInfo = query.WrongOddsSportsBookModel?.ToWrongOddsSportsBookInfoXml();
        criteria.ReducedOverInfo = query.ReducedOverModels?.ToReducedOverInfoXml();
        criteria.NotParticipateInfo = query.NotParticipateModels?.ToNotParticipateInfoXml();
        criteria.WrongMarketOfferedInfo = query.WrongMarketOfferedModels?.ToWrongMarketOfferedInfoXml();
        criteria.TechnicalErrorInfo = query.TechnicalErrorModel?.ToTechnicalErrorInfoXml();
        criteria.WrongOfferedNameInfo = query.WrongOfferedNameModel?.ToWrongOfferedNameInfoXml();
        criteria.OtherIssuesInfo = query.OtherIssuesModel?.ToOtherIssuesInfoXml();

        return criteria;
    }

    private IEnumerable<BetTypeTicketsInfo> UpdateBetTypeName(IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        var updated = betTypeTickets.Select(item =>
        {
            item.BetTypeName = betListService.GetBetTypeName(new Ticket
            {
                BetTypeId = item.BetTypeId,
                BetId = item.BetId
            });
            return item;
        }).ToList();

        return updated;
    }

    public async Task<IEnumerable<BetTypeTicketsInfo>> UpdateBetTypeTicketsInfo(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        var preparedBetTypeTickets = UpdateBetTypeName(betTypeTickets);
        await copyRequestInfoService.UpdatePlayerNameForBetTypeNextManOut(matchId, preparedBetTypeTickets);

        return preparedBetTypeTickets;
    }
}