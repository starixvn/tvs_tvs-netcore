using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface LogInfoService
{
    Task<GetLogInfoViewModel> GetLogInfo(GetLogInfoQuery query);
}

public class LogInfoServiceImp : LogInfoService
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService session;
    private readonly GetTransInfoService getTransInfoService;

    public LogInfoServiceImp(IMapper mapper, IDynamicRepository repository, SessionService session, GetTransInfoService getTransInfoService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.session = session;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<GetLogInfoViewModel> GetLogInfo(GetLogInfoQuery query)
    {
        var criteria = await GetLogInfoCriteria(query);
        var mappingTypes = new[] { typeof(Validation), typeof(TicketRequest), typeof(LogInfoDetail), typeof(TransInfoAddRequestModel), typeof(string) };
        var result = await repository.FetchMultipleAsync(criteria, mappingTypes);
        var validation = result[0].Cast<Validation>();
        var ticketRequest = result[1].Cast<TicketRequest>();
        var logInfoDetail = result[2].Cast<LogInfoDetail>();
        var transInfoAddRequestModel = result[3].Cast<TransInfoAddRequestModel>().FirstOrDefault();
        var transInfoJson = result[4].Cast<string>();

        return new GetLogInfoViewModel
        {
            GetLogInfoModels = GetLogInfoModels(query, validation, ticketRequest, logInfoDetail),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = transInfoAddRequestModel?.RemoveTransIds,
                UnMarkTransIds = transInfoAddRequestModel?.UnMarkTransIds,
                MarkTransIds = transInfoAddRequestModel?.MarkTransIds,
                TransInfoJson = transInfoJson.FirstOrDefault()
            }
        };
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoModels(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        switch (query.IssueTypeId)
        {
            case IssueTypeConstant.WrongScore:
                return GetLogInfoViewModelWrongScore(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.DangerAccepted:
                return GetLogInfoViewModelDangerAccepted(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.RedCard:
                return GetLogInfoViewModelRedCard(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.WrongHDP:
                return GetLogInfoViewModelWrongHdp(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.Wrong1stHDP:
                return GetLogInfoViewModelWrong1stHdp(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.WrongOU:
                return GetLogInfoViewModelWrongOu(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.Wrong1stOU:
                return GetLogInfoViewModelWrong1stOu(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.WrongOdds:
                return GetLogInfoViewModelWrongOdds(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.ReducedOver:
                return GetLogInfoViewModelReducedOver(query, validation, ticketRequest, logInfoDetail);

            case IssueTypeConstant.NotParticipate:
                return GetLogInfoViewModelNotParticipate(query, validation, ticketRequest, logInfoDetail);

            default:
                return GetLogInfoViewModelDefault(validation, ticketRequest, logInfoDetail);
        }
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongScore(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.WrongScoreModels.Select(item => new GetLogInfoModel
        {
            ScoreId = item.ScoreId,
            Validation = validation.FirstOrDefault(x => x.ScoreId == item.ScoreId),
            TicketRequest = ticketRequest.Where(x => x.ScoreId == item.ScoreId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.ScoreId == item.ScoreId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelDangerAccepted(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.DangerAcceptedModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelRedCard(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.RedCardModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongHdp(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.WrongHdpModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrong1stHdp(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.Wrong1stHdpModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongOu(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.WrongOuModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrong1stOu(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.Wrong1stOuModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongOdds(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.WrongOddsModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelReducedOver(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.ReducedOverModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId),
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelNotParticipate(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.NotParticipateModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId),
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelDefault(IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return new List<GetLogInfoModel>
            {
                new()
                {
                    Validation = validation.FirstOrDefault(),
                    TicketRequest = ticketRequest,
                    LogInfoDetail = logInfoDetail.FirstOrDefault()
                }
            };
    }

    private async Task<GetLogInfoCriteria> GetLogInfoCriteria(GetLogInfoQuery query)
    {
        var transInfoJsonList = await GetTransInfoJson(query);
        var criteria = mapper.Map<GetLogInfoCriteria>(query);
        criteria.UserId = session.UserId;
        criteria.KickOffInfo = GetKickOffInfo(query);
        criteria.WrongScoreInfo = query.WrongScoreModels?.ToWrongScoreInfoXml();
        criteria.DangerAcceptedInfo = query.DangerAcceptedModels?.ToDangerAcceptedInfoXml();
        criteria.RedCardInfo = query.RedCardModels?.ToDangerAcceptedInfoXml();
        criteria.WrongHdpInfo = query.WrongHdpModels?.ToWrongHdpInfoXml();
        criteria.Wrong1stHdpInfo = query.Wrong1stHdpModels?.ToWrongHdpInfoXml();
        criteria.WrongOuInfo = query.WrongOuModels?.ToWrongOuInfoXml();
        criteria.Wrong1stOuInfo = query.Wrong1stOuModels?.ToWrongOuInfoXml();
        criteria.WrongOddsInfo = query.WrongOddsModels?.ToWrongOddsInfoXml();
        criteria.ReducedOverInfo = query.ReducedOverModels?.ToReducedOverInfoXml();
        criteria.NotParticipateInfo = query.NotParticipateModels?.ToNotParticipateInfoXml();
        criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));

        return criteria;
    }

    private static string GetKickOffInfo(GetLogInfoQuery query)
    {
        return (query.IssueTypeId is IssueTypeConstant.EarlyKickOffTime or IssueTypeConstant.WrongKickOffTime) ?
            LogInfoExtension.GetKickOffInfoXml(query.MatchId, query.KickOffTime.ZoneCanada()) : null;
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(GetLogInfoQuery query)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            WrongScoreModels = query.WrongScoreModels,
            RedCardModels = query.RedCardModels,
            DangerAcceptedModels = query.DangerAcceptedModels,
            WrongHdpModels = query.WrongHdpModels,
            Wrong1stHdpModels = query.Wrong1stHdpModels,
            WrongOuModels = query.WrongOuModels,
            Wrong1stOuModels = query.Wrong1stOuModels,
            WrongOddsModels = query.WrongOddsModels,
            ReducedOverModels = query.ReducedOverModels,
            NotParticipateModels = query.NotParticipateModels,
            MatchId = query.MatchId,
            KickOffTime = query.KickOffTime,
            IssueTypeId = query.IssueTypeId
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}