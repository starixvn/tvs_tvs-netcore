using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface UpdateRequestProcessStage
{
    Task<Result> Execute(EditRequestQuery query, IEnumerable<long> markedTicketsSuccessful);
}

public class UpdateRequestProcessStageImp(
    IMapper mapper,
    IDynamicRepository repository,
    LoggingService loggingService,
    AccountWinLostService accountWinLostService,
    SessionService sessionService,
    InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService,
    GetUpdateResultService getUpdateResultService,
    CompressDataService compressDataService)
    : UpdateRequestProcessStage
{
    public async Task<Result> Execute(EditRequestQuery query, IEnumerable<long> markedTicketsSuccessful)
    {
        try
        {
            var command = CreateEditRequestCommand(query);
            var matchIdsAutoVoidRequestQueue = insertAutoVoidRequestQueueService.GetMatchIdsInRequest(query.AbnormalBetInfo, query.EarlyKickOffInfo, query.WrongOfferedNameInfo);
            await repository.ExecuteAsync(command);
            await insertAutoVoidRequestQueueService.Execute(query.RequestId, query.ActionId, matchIdsAutoVoidRequestQueue);
            if (query.IssueTypeId.IsAbnormalAccount())
            {
                await accountWinLostService.SaveAccountWinLost(command.RequestId, query.ActionId, query.AbnormalAccountInfo.AccountWinlostModels);
            }

            return getUpdateResultService.CreateSuccessResult(query.RequestId, query.MatchId.ToString(), markedTicketsSuccessful);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            return getUpdateResultService.CreateErrorResult(exception, markedTicketsSuccessful);
        }
    }

    private EditRequestCommand CreateEditRequestCommand(EditRequestQuery query)  // NOSONAR
    {
        var adjustedTicketsJson = "";
        if (query.AbnormalAccountInfo?.AdjustedTickets?.Count() > 0)
        {
            adjustedTicketsJson = compressDataService.CompressTicket(query.AbnormalAccountInfo?.AdjustedTickets);
        }
        var command = mapper.Map<EditRequestCommand>(query);
        command.Operators = query.OperatorsList?.OperatorToXml();
        command.UserId = sessionService.UserId;
        command.IP = sessionService.GetClientIp();
        command.TransInfoJson = query.TransInfoJson;
        command.WrongScoreInfo = query.WrongScoreInfo?.ToEventWrongScoreXml();
        command.WrongOuInfo = query.WrongOuInfo?.ToEventWrongOuXml();
        command.Wrong1stOuInfo = query.Wrong1stOuInfo?.ToEventWrongOuXml();
        command.WrongHdpInfo = query.WrongHdpInfo?.ToEventWrongHdpXml();
        command.Wrong1stHdpInfo = query.Wrong1stHdpInfo?.ToEventWrongHdpXml();
        command.WrongOddsInfo = query.WrongOddsInfo?.ToEventWrongOddsXml();
        command.WrongOddsSBInfo = query.WrongOddsSportsBookInfo?.ToEventWrongOddsSportsBookXml();
        command.ReducedOverInfo = query.ReducedOverInfo?.ToEventReducedOverXml();
        command.NotParticipateInfo = query.NotParticipateInfo?.ToEventNotParticipateXml();
        command.DangerAcceptedInfo = query.DangerAcceptedInfo?.ToEventDangerAcceptedXml();
        command.RedCardInfo = query.RedCardInfo?.ToEventDangerAcceptedXml();
        command.AbnormalAccountInfo = query.AbnormalAccountInfo?.ToAbnormalAccountXml(adjustedTicketsJson);
        command.DuplicateTicketsInfo = query.DuplicateTicketsInfo?.ToDuplicateTicketsXml();
        command.RecoverTicketInfo = query.RecoverTicketInfo?.ToEventRecoverTicketXml();
        command.KickOffInfo = query.EarlyKickOffInfo?.ToEventKickOffXml();
        command.AbnormalBetInfo = query.AbnormalBetInfo?.ToEventAbnormalBetXml();
        command.WrongMarketOfferedInfo = query.WrongMarketOfferedInfo?.ToEventWrongMarketOfferedXml();
        command.TechnicalErrorInfo = query.TechnicalErrorInfo?.ToEventTechnicalErrorXml();
        command.WrongOfferedNameInfo = query.WrongOfferedNameInfo?.ToEventWrongOfferedNameXml();
        command.OtherIssuesInfo = query.OtherIssuesInfo?.ToEventOtherIssuesXml();

        return command;
    }
}