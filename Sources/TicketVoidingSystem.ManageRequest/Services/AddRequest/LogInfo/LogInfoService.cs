using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

public interface LogInfoService
{
    Task<GetLogInfoViewModel> GetLogInfo(GetLogInfoQuery query);
}

public class LogInfoServiceImp(
    IMapper mapper,
    IDynamicRepository repository,
    SessionService session,
    LogInfoHelperService logInfoHelperService)
    : LogInfoService
{
    public async Task<GetLogInfoViewModel> GetLogInfo(GetLogInfoQuery query)
    {
        var criteria = await GetLogInfoCriteria(query);
        var (validations, ticketRequests, logInfoDetails, transInfoAddRequestModels, transInfoJsonList, betTypeCounts) =
            await repository.FetchMultipleAsync<Validation, TicketRequest, LogInfoDetail, TransInfoAddRequestModel, string, BetTypeTicketsInfo>(criteria);
        var transInfoAddRequest = transInfoAddRequestModels.FirstOrDefault();
        var transInfoJson = transInfoJsonList.FirstOrDefault();

        var logInfoModels = await GetLogInfoModels(query, validations, ticketRequests, logInfoDetails, betTypeCounts);
        return new GetLogInfoViewModel
        {
            GetLogInfoModels = logInfoModels,
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = transInfoAddRequest?.RemoveTransIds,
                UnMarkTransIds = transInfoAddRequest?.UnMarkTransIds,
                MarkTransIds = transInfoAddRequest?.MarkTransIds,
                TransInfoJson = transInfoJson
            }
        };
    }

    private async Task<IEnumerable<GetLogInfoModel>> GetLogInfoModels(GetLogInfoQuery query, IEnumerable<Validation> validation, // NOSONAR
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail, IEnumerable<BetTypeTicketsInfo> betTypeCount)
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
            IssueTypeConstant.WrongOddsSportsBook => GetLogInfoViewModelWrongOddsSportsBook(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.ReducedOver => GetLogInfoViewModelReducedOver(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.Abandoned => GetLogInfoViewModelReducedOver(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.NotParticipate => GetLogInfoViewModelNotParticipate(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.EarlyKickOffTime => GetLogInfoViewModelEarlyKickOff(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.WrongKickOffTime => GetLogInfoViewModelEarlyKickOff(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.WrongMarketOffered => await GetLogInfoViewModelWrongMarketOffered(query, validation, ticketRequest, logInfoDetail, betTypeCount),
            IssueTypeConstant.TechnicalError => await GetLogInfoViewModelTechnicalError(query, validation, ticketRequest, logInfoDetail, betTypeCount),
            IssueTypeConstant.WrongOfferedName => GetLogInfoViewModelWrongOfferedName(query, validation, ticketRequest, logInfoDetail),
            IssueTypeConstant.OtherIssues => GetLogInfoViewModelOtherIssues(query, validation, ticketRequest, logInfoDetail),
            _ => GetLogInfoViewModelDefault(validation, ticketRequest, logInfoDetail)
        };
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongScore(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.WrongScoreModels.Select(item => new GetLogInfoModel
        {
            ScoreId = item.ScoreId,
            Validation = validation.FirstOrDefault(x => x.ScoreId == item.ScoreId && x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.ScoreId == item.ScoreId && x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.ScoreId == item.ScoreId && x.MatchId == item.MatchId),
            MatchId = item.MatchId
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
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
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
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
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
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private async Task<IEnumerable<GetLogInfoModel>> GetLogInfoViewModelWrongMarketOffered(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail, IEnumerable<BetTypeTicketsInfo> betTypeCount)
    {
        await logInfoHelperService.UpdateBetTypeTicketsInfo(query.WrongMarketOfferedModels.First().MatchId, betTypeCount);

        return query.WrongMarketOfferedModels.Select((item, index) => new GetLogInfoModel
        {
            Id = index + 1,
            MatchId = query.WrongMarketOfferedModels.First().MatchId,
            Validation = validation.FirstOrDefault(x => x.Id == item.Id),
            TicketRequest = ticketRequest.Where(x => x.Id == item.Id),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.Id == item.Id),
            BetTypeCount = betTypeCount.Where(x => x.Id == item.Id)
                .OrderBy(x => x.OriginalBetTypeName)
                .ThenBy(x => x.BetId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongOddsSportsBook(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return new List<GetLogInfoModel>
        {
            new()
            {
                MatchId = query.WrongOddsSportsBookModel.MatchId,
                Validation = validation.FirstOrDefault(),
                TicketRequest = ticketRequest,
                LogInfoDetail = logInfoDetail.FirstOrDefault()
            }
        };
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongOfferedName(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return new List<GetLogInfoModel>
        {
            new()
            {
                MatchId = query.WrongOfferedNameModel.MatchId,
                Validation = validation.FirstOrDefault(),
                TicketRequest = ticketRequest,
                LogInfoDetail = logInfoDetail.FirstOrDefault()
            }
        };
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelOtherIssues(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return new List<GetLogInfoModel>
        {
            new()
            {
                MatchId = query.OtherIssuesModel.MatchId,
                Validation = validation.FirstOrDefault(),
                TicketRequest = ticketRequest,
                LogInfoDetail = logInfoDetail.FirstOrDefault(),
            }
        };
    }

    private async Task<IEnumerable<GetLogInfoModel>> GetLogInfoViewModelTechnicalError(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail, IEnumerable<BetTypeTicketsInfo> betTypeCount)
    {
        await logInfoHelperService.UpdateBetTypeTicketsInfo(query.TechnicalErrorModel.MatchId, betTypeCount);
        return new List<GetLogInfoModel>
        {
            new()
            {
                MatchId = query.TechnicalErrorModel.MatchId,
                Validation = validation.FirstOrDefault(),
                TicketRequest = ticketRequest,
                LogInfoDetail = logInfoDetail.FirstOrDefault(),
                BetTypeCount = betTypeCount.OrderBy(x => x.OriginalBetTypeName).ThenBy(x => x.BetId)
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
        var transInfoJsonList = await logInfoHelperService.GetTransInfoJson(query);
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
        criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));

        return criteria;
    }
}