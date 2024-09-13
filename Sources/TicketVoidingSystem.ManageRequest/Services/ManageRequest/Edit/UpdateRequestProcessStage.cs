using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface UpdateRequestProcessStage
{
    Task<Result> Execute(EditRequestQuery query, IEnumerable<long> markedTicketsSuccessful);
}

public class UpdateRequestProcessStageImp : UpdateRequestProcessStage
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly AccountWinLostService accountWinLostService;
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;
    private readonly GetUpdateResultService getUpdateResultService;

    public UpdateRequestProcessStageImp(IMapper mapper,
        IDynamicRepository repository, LoggingService loggingService, AccountWinLostService accountWinLostService,
        SessionService sessionService, InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService, GetUpdateResultService getUpdateResultService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
        this.accountWinLostService = accountWinLostService;
        this.insertAutoVoidRequestQueueService = insertAutoVoidRequestQueueService;
        this.getUpdateResultService = getUpdateResultService;
    }

    public async Task<Result> Execute(EditRequestQuery query, IEnumerable<long> markedTicketsSuccessful)
    {
        try
        {
            var command = CreateEditRequestCommand(query);
            await repository.ExecuteAsync(command);
            await insertAutoVoidRequestQueueService.Execute(query.RequestId, query.ActionId, query.AbnormalBetInfo, query.EarlyKickOffInfo);
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

        return command;
    }
}