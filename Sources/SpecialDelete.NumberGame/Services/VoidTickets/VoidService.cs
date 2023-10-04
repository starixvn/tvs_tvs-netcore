using AutoMapper;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.NumberGame.Services.VoidTickets;

public interface VoidService
{
    Task<(IEnumerable<TicketEmailModel> Tickets, Result Validation)> VoidTickets(VoidTicketsQuery query);

    Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);

    Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);
}

public class VoidServiceImp : VoidService
{
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly Repository repository;
    private readonly LoggingService loggingService;
    private readonly SendMessageService sendMessageService;
    private readonly SendEmailService sendEmailService;

    public VoidServiceImp(
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

    public async Task<(IEnumerable<TicketEmailModel> Tickets, Result Validation)> VoidTickets(VoidTicketsQuery query)
    {
        try
        {
            return await repository.VoidTickets(query);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(query.MatchId.ToString(), exception);
            var validation = new Result
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };

            return (Enumerable.Empty<TicketEmailModel>(), validation);
        }
    }

    public async Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        query.Message.CreatorId = sessionService.UserId;
        query.Message.CreatorName = sessionService.UserName;
        var messageId = await sendMessageService.InsertMessage(query.Message, query.MatchId, null, false);
        var reasonId = await sendMessageService.InsertReason(query.Reason, query.ReasonSC);
        await sendMessageService.SendMessage(tickets, messageId, 0, query.Message.CreatorId);
        await sendMessageService.InsertMessageIntoAdminSite(query.Message);
        await sendMessageService.InsertVoidedTransaction(tickets, messageId, reasonId, 0, 0);
    }

    public async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var emailModel = mapper.Map<EmailVoidModel>(query);
        return await sendEmailService.SendEmail(emailModel, tickets.ToList());
    }
}