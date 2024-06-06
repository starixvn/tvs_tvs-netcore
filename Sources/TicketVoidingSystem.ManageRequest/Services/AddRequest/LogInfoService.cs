using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;

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
    private readonly BetListService betListService;

    public LogInfoServiceImp(IMapper mapper, IDynamicRepository repository, SessionService session, GetTransInfoService getTransInfoService, BetListService betListService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.session = session;
        this.betListService = betListService;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<GetLogInfoViewModel> GetLogInfo(GetLogInfoQuery query)
    {
        var criteria = await GetLogInfoCriteria(query);

        var (validations, ticketRequests, logInfoDetails, transInfoAddRequestModels, transInfoJsonList, betTypeCounts) =
            await repository.FetchMultipleAsync<Validation, TicketRequest, LogInfoDetail, TransInfoAddRequestModel, string, BetTypeCountModel>(criteria);
        var transInfoAddRequest = transInfoAddRequestModels.FirstOrDefault();
        var transInfoJson = transInfoJsonList.FirstOrDefault();

        return new GetLogInfoViewModel
        {
            GetLogInfoModels = GetLogInfoModels(query, validations, ticketRequests, logInfoDetails, betTypeCounts),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = transInfoAddRequest?.RemoveTransIds,
                UnMarkTransIds = transInfoAddRequest?.UnMarkTransIds,
                MarkTransIds = transInfoAddRequest?.MarkTransIds,
                TransInfoJson = transInfoJson
            }
        };
    }

    private IEnumerable<GetLogInfoModel> GetLogInfoModels(GetLogInfoQuery query, IEnumerable<Validation> validation, // NOSONAR
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail, IEnumerable<BetTypeCountModel> betTypeCount)
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.WrongScore => GetLogInfoViewModelWrongScore(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.DangerAccepted => GetLogInfoViewModelDangerAccepted(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.RedCard => GetLogInfoViewModelRedCard(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.WrongHDP => GetLogInfoViewModelWrongHdp(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.Wrong1stHDP => GetLogInfoViewModelWrong1stHdp(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.WrongOU => GetLogInfoViewModelWrongOu(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.Wrong1stOU => GetLogInfoViewModelWrong1stOu(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.WrongOdds => GetLogInfoViewModelWrongOdds(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.ReducedOver => GetLogInfoViewModelReducedOver(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.Abandoned => GetLogInfoViewModelReducedOver(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.NotParticipate => GetLogInfoViewModelNotParticipate(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.EarlyKickOffTime => GetLogInfoViewModelEarlyKickOff(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.WrongKickOffTime => GetLogInfoViewModelEarlyKickOff(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.WrongMarketOffered => GetLogInfoViewModelWrongMarketOffered(query, validation, ticketRequest, logInfoDetail, betTypeCount),
            IssueTypeConstant.TechnicalError => GetLogInfoViewModelWrongMarketOffered(query, validation, ticketRequest, logInfoDetail, betTypeCount),
            _ => GetLogInfoViewModelDefault(validation, ticketRequest, logInfoDetail)
        };
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

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelEarlyKickOff(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.EarlyKickOffModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId),
        });
    }

    private IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongMarketOffered(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail, IEnumerable<BetTypeCountModel> betTypeCount)
    {
        foreach (var item in betTypeCount)
        {
            item.BetTypeName = betListService.GetBetTypeName(new Ticket
            {
                BetTypeId = item.BetTypeId,
                BetId = item.BetId,
            });
        }
        return new List<GetLogInfoModel>
        {
            new()
            {
                MatchId = query.WrongMarketOfferedModel.MatchId,
                Validation = validation.FirstOrDefault(),
                TicketRequest = ticketRequest,
                LogInfoDetail = logInfoDetail.FirstOrDefault(),
                BetTypeCount = betTypeCount
            }
        };
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

    private async Task<GetLogInfoCriteria> GetLogInfoCriteria(GetLogInfoQuery query) //NOSONAR
    {
        var transInfoJsonList = await GetTransInfoJson(query);
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
        criteria.ReducedOverInfo = query.ReducedOverModels?.ToReducedOverInfoXml();
        criteria.NotParticipateInfo = query.NotParticipateModels?.ToNotParticipateInfoXml();
        criteria.WrongMarketOfferedInfo = query.IssueTypeId.IsWrongMarketOffered() ? query.WrongMarketOfferedModel?.ToWrongMarketOfferedInfoXml() : null;
        criteria.TechnicalErrorInfo = query.IssueTypeId.IsTechnicalError() ? query.WrongMarketOfferedModel?.ToWrongMarketOfferedInfoXml() : null;
        criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));

        return criteria;
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
            EarlyKickOffModels = query.EarlyKickOffModels,
            WrongMarketOfferedModel = query.WrongMarketOfferedModel,
            MatchId = query.MatchId,
            IssueTypeId = query.IssueTypeId
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}