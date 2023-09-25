using AutoMapper;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Services.VoidTickets;

public interface VoidTicketsService
{
    Task<VoidTicketsModel> ExecuteQuery(VoidTicketsQuery query);

    Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);

    Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, VoidTicketsModel model);
}

public class VoidTicketsServiceImp : VoidTicketsService
{
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly Repository repository;
    private readonly LoggingService loggingService;
    private readonly SendMessageService sendMessageService;
    private readonly SendEmailService sendEmailService;

    public VoidTicketsServiceImp(
        IMapper mapper,
        SessionService sessionService,
        Repository repository,
        LoggingService loggingService,
        SendMessageService sendMessageService,
        SendEmailService sendEmailService)
    {
        this.mapper = mapper;
        this.sessionService = sessionService;
        this.repository = repository;
        this.loggingService = loggingService;
        this.sendMessageService = sendMessageService;
        this.sendEmailService = sendEmailService;
    }

    public async Task<VoidTicketsModel> ExecuteQuery(VoidTicketsQuery query)
    {
        try
        {
            return await repository.VoidTickets(query);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(query.MatchId.ToString(), exception);
            var validation = new VoidTicketsValidation
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };

            return new VoidTicketsModel
            {
                Validation = validation,
                Tickets = Enumerable.Empty<TicketEmailModel>()
            };
        }
    }

    public async Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        query.Message.CreatorName = sessionService.UserName;
        query.Message.CreatorId = sessionService.UserId;
        var messageId = await sendMessageService.InsertMessage(query.Message, query.MatchId, null, false);
        var reasonId = await sendMessageService.InsertReason(query.Reason, query.ReasonSC);
        await sendMessageService.SendMessage(tickets, messageId, 0, query.Message.CreatorId);
        await sendMessageService.InsertMessageIntoAdminSite(query.Message);
        await sendMessageService.InsertVoidedTransaction(tickets, messageId, reasonId, 0, 0);
    }

    public async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var emailModel = mapper.Map<EmailVoidModel>(query);
        emailModel.NegativeBalanceUsers = model.Validation.NegativeBalanceUsers;
        return await sendEmailService.SendEmail(emailModel, model.Tickets);
    }
}