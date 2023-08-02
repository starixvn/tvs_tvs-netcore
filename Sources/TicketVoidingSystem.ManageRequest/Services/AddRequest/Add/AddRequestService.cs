using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface AddRequestService
{
    Task<Result> Execute(AddRequestQuery query);
}

public class AddRequestServiceImp : AddRequestService
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly MarkTicketsService markTicketsService;
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;
    private readonly SendLetstalkAfterAddService sendLetstalkAfterAddService;

    public AddRequestServiceImp(IMapper mapper,
        IDynamicRepository repository,
        SessionService sessionService,
        LoggingService loggingService,
        MarkTicketsService markTicketsService,
        InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService,
        SendLetstalkAfterAddService sendLetstalkAfterAddService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
        this.markTicketsService = markTicketsService;
        this.insertAutoVoidRequestQueueService = insertAutoVoidRequestQueueService;
        this.sendLetstalkAfterAddService = sendLetstalkAfterAddService;
    }

    public async Task<Result> Execute(AddRequestQuery query)
    {
        try
        {
            var markTicketResults = Enumerable.Empty<Result>();
            if (!query.IssueTypeId.IsArchivedTicket() && !string.IsNullOrWhiteSpace(query.MarkTransIds))
            {
                markTicketResults = await markTicketsService.MarkTicketsInTVS(query.MarkTransIds, query.IssueTypeId, MarkTypeConstant.ExecuteMarkTickets);
            }

            return markTicketResults.All(x => x.IsSuccessful) ? await ExecuteAddAfterMarkTickets(query) : markTicketResults.First(x => !x.IsSuccessful);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            return new Result
            {
                ErrorCode = 1,
                ErrorMsg = exception.Message,
            };
        }
    }

    private async Task<Result> ExecuteAddAfterMarkTickets(AddRequestQuery query)
    {
        try
        {
            var requestId = await ExecuteAddRequest(query);
            await insertAutoVoidRequestQueueService.Execute(requestId, query.IssueTypeId, query.MatchId, query.ActionId);
            await sendLetstalkAfterAddService.Execute(query, requestId);
            return new Result
            {
                Data = new AddRequestResultData
                {
                    RequestId = requestId,
                    MatchId = GetMatchIdAfterAddRequest(query)
                }
            };
        }
        catch (Exception e)
        {
            return new Result
            {
                ErrorCode = 1,
                ErrorMsg = e.Message
            };
        }
    }

    private async Task<int> ExecuteAddRequest(AddRequestQuery query)
    {
        var command = mapper.Map<AddRequestCommand>(query);
        command.Operators = query.OperatorsList.OperatorToXml();
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
        command.DangerAcceptedInfo = query.DangerAcceptedInfo?.ToEventDangerAcceptedXml();
        command.RedCardInfo = query.RedCardInfo?.ToEventDangerAcceptedXml();
        command.AbnormalAccountInfo = query.AbnormalAccountInfo?.ToAbnormalAccountXml();
        command.KickOffInfo = query.IssueTypeId.IsEarlyKickOffOrWrongKickOff()
            ? LogInfoExtension.GetKickOffInfoXml(query.MatchId, query.KickOffTime.ZoneCanada()) : null;

        await repository.ExecuteAsync(command);
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
            IssueTypeConstant.WrongScore => query.WrongScoreInfo.First().MatchId.ToString(),
            IssueTypeConstant.EarlyKickOffTime => query.MatchId.ToString(),
            IssueTypeConstant.WrongKickOffTime => query.MatchId.ToString(),
            IssueTypeConstant.AbnormalBetRealMember => query.MatchId.ToString(),
            IssueTypeConstant.AbnormalBet => query.MatchId.ToString(),
            _ => string.Empty
        };
    }
}