using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface UpdateRequestProcessStage
{
    Task<Result> Execute(EditRequestQuery query);
}

public class UpdateRequestProcessStageImp : UpdateRequestProcessStage
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;

    public UpdateRequestProcessStageImp(IMapper mapper,
        IDynamicRepository repository,
        SessionService sessionService, InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
        this.insertAutoVoidRequestQueueService = insertAutoVoidRequestQueueService;
    }

    public async Task<Result> Execute(EditRequestQuery query)
    {
        try
        {
            var command = CreateEditRequestCommand(query);
            await repository.ExecuteAsync(command);
            await insertAutoVoidRequestQueueService.Execute(query.RequestId, query.ActionId, query.EarlyKickOffInfo);

            return new Result
            {
                Data = new
                {
                    query.MatchId,
                    command.RequestId
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
        command.KickOffInfo = query.EarlyKickOffInfo?.ToKickOffInfoXml();

        return command;
    }
}