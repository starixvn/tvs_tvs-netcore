using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface AddRequestProcessStage
{
    Task<Result> Execute(AddRequestQuery query, IEnumerable<long> markedTicketsSuccessful);
}

public class AddRequestProcessStageImp : AddRequestProcessStage
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly AccountWinLostService accountWinLostService;
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;
    private readonly SendLetstalkAfterAddService sendLetstalkAfterAddService;
    private readonly GetUpdateResultService getUpdateResultService;

    public AddRequestProcessStageImp(IMapper mapper,  // NOSONAR
        IDynamicRepository repository,
        SessionService sessionService,
        LoggingService loggingService,
        AccountWinLostService accountWinLostService,
        InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService,
        SendLetstalkAfterAddService sendLetstalkAfterAddService,
        GetUpdateResultService getUpdateResultService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
        this.accountWinLostService = accountWinLostService;
        this.insertAutoVoidRequestQueueService = insertAutoVoidRequestQueueService;
        this.sendLetstalkAfterAddService = sendLetstalkAfterAddService;
        this.getUpdateResultService = getUpdateResultService;
    }

    public async Task<Result> Execute(AddRequestQuery query, IEnumerable<long> markedTicketsSuccessful)
    {
        try
        {
            var requestId = await ExecuteAddRequest(query);
            var matchIdsAutoVoidRequestQueue = insertAutoVoidRequestQueueService.GetMatchIdsInRequest(query.AbnormalBetInfo, query.EarlyKickOffInfo, query.WrongOfferedNameInfo);
            await insertAutoVoidRequestQueueService.Execute(requestId, query.ActionId, matchIdsAutoVoidRequestQueue);
            await sendLetstalkAfterAddService.Execute(query.AbnormalBetInfo, requestId);

            return getUpdateResultService.CreateSuccessResult(requestId, GetMatchIdAfterAddRequest(query), markedTicketsSuccessful);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            return getUpdateResultService.CreateErrorResult(exception, markedTicketsSuccessful);
        }
    }

    private async Task<int> ExecuteAddRequest(AddRequestQuery query)  // NOSONAR
    {
        var command = mapper.Map<AddRequestCommand>(query);
        command.Operators = query.OperatorsList?.OperatorToXml();
        command.UserId = sessionService.UserId;
        command.IP = sessionService.GetClientIp();
        command.TransInfoJson = query.TransInfoJson;
        command.WrongScoreInfo = query.WrongScoreInfo?.ToEventWrongScoreXml();
        command.WrongHdpInfo = query.WrongHdpInfo?.ToEventWrongHdpXml();
        command.Wrong1stHdpInfo = query.Wrong1stHdpInfo?.ToEventWrongHdpXml();
        command.WrongOuInfo = query.WrongOuInfo?.ToEventWrongOuXml();
        command.Wrong1stOuInfo = query.Wrong1stOuInfo?.ToEventWrongOuXml();
        command.WrongOddsInfo = query.WrongOddsInfo?.ToEventWrongOddsXml();
        command.ReducedOverInfo = query.ReducedOverInfo?.ToEventReducedOverXml();
        command.NotParticipateInfo = query.NotParticipateInfo?.ToEventNotParticipateXml();
        command.DangerAcceptedInfo = query.DangerAcceptedInfo?.ToEventDangerAcceptedXml();
        command.RedCardInfo = query.RedCardInfo?.ToEventDangerAcceptedXml();
        command.AbnormalAccountInfo = query.AbnormalAccountInfo?.ToAbnormalAccountXml();
        command.DuplicateTicketsInfo = query.DuplicateTicketsInfo?.ToDuplicateTicketsXml();
        command.RecoverTicketInfo = query.RecoverTicketInfo?.ToEventRecoverTicketXml();
        command.KickOffInfo = query.EarlyKickOffInfo?.ToEventKickOffXml();
        command.AbnormalBetInfo = query.AbnormalBetInfo?.ToEventAbnormalBetXml();
        command.WrongMarketOfferedInfo = query.IssueTypeId.IsWrongMarketOffered() ? query.WrongMarketOfferedInfo?.ToEventWrongMarketOfferedXml() : null;
        command.TechnicalErrorInfo = query.IssueTypeId.IsTechnicalError() ? query.WrongMarketOfferedInfo?.ToEventWrongMarketOfferedXml() : null;
        command.WrongOddsSBInfo = query.WrongOddsSportsBookInfo?.ToEventWrongOddsSportsBookXml();
        command.WrongOfferedNameInfo = query.WrongOfferedNameInfo?.ToEventWrongOfferedNameXml();

        await repository.ExecuteAsync(command);
        if (query.IssueTypeId.IsAbnormalAccount() && query.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId)
        {
            await accountWinLostService.SaveAccountWinLost(command.RequestId, query.ActionId, query.AbnormalAccountInfo.AccountWinlostModels);
        }

        return command.RequestId;
    }

    private static string GetMatchIdAfterAddRequest(AddRequestQuery query) // NOSONAR
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.DangerAccepted => string.Join(", ", query.DangerAcceptedInfo.Select(x => x.MatchId)),
            IssueTypeConstant.WrongHDP => string.Join(", ", query.WrongHdpInfo.Select(x => x.MatchId)),
            IssueTypeConstant.Wrong1stHDP => string.Join(", ", query.Wrong1stHdpInfo.Select(x => x.MatchId)),
            IssueTypeConstant.WrongOU => string.Join(", ", query.WrongOuInfo.Select(x => x.MatchId)),
            IssueTypeConstant.Wrong1stOU => string.Join(", ", query.Wrong1stOuInfo.Select(x => x.MatchId)),
            IssueTypeConstant.RedCard => string.Join(", ", query.RedCardInfo.Select(x => x.MatchId)),
            IssueTypeConstant.WrongOdds => string.Join(", ", query.WrongOddsInfo.Select(x => x.MatchId)),
            IssueTypeConstant.ReducedOver => query.ReducedOverInfo.First().MatchId.ToString(),
            IssueTypeConstant.Abandoned => query.ReducedOverInfo.First().MatchId.ToString(),
            IssueTypeConstant.NotParticipate => query.NotParticipateInfo.First().MatchId.ToString(),
            IssueTypeConstant.WrongScore => query.WrongScoreInfo.First().MatchId.ToString(),
            IssueTypeConstant.EarlyKickOffTime => string.Join(", ", query.EarlyKickOffInfo.Select(x => x.MatchId)),
            IssueTypeConstant.WrongKickOffTime => string.Join(", ", query.EarlyKickOffInfo.Select(x => x.MatchId)),
            IssueTypeConstant.AbnormalBet => query.AbnormalBetInfo?.Matches?.Count() > 0
                ? string.Join(", ", query.AbnormalBetInfo.Matches.Select(x => x.MatchId))
                : BetTypeConstant.SystemParlay.ToString(),
            IssueTypeConstant.DuplicateTickets => query.DuplicateTicketsInfo?.MatchId.ToString(),
            IssueTypeConstant.WrongMarketOffered => query.WrongMarketOfferedInfo?.MatchId.ToString(),
            IssueTypeConstant.TechnicalError => query.WrongMarketOfferedInfo?.MatchId.ToString(),
            IssueTypeConstant.WrongOddsSportsBook => query.WrongOddsSportsBookInfo?.MatchId.ToString(),
            IssueTypeConstant.WrongOfferedName => query.WrongOfferedNameInfo?.MatchId.ToString(),
            _ => string.Empty
        };
    }
}