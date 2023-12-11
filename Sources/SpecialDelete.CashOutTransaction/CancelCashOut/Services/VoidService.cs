using AutoMapper;
using SpecialDelete.CashOutTransaction.CancelCashOut.Criteria;
using SpecialDelete.CashOutTransaction.CancelCashOut.Models;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Services;

public interface VoidService
{
    Task<SubmittedTicketsModel<TicketEmailModel>> ExecuteQuery(VoidTicketsQuery query);

    Task SendMessage(VoidTicketsQuery ticketQuery, IEnumerable<TicketEmailModel> tickets);

    Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery ticketQuery, IEnumerable<TicketEmailModel> tickets);
}

public class VoidServiceImp : VoidService
{
    private readonly IMapper mapper;
    private readonly Repository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly SendMessageService messageService;
    private readonly SendEmailService sendEmailService;

    public VoidServiceImp(IMapper mapper,
        Repository repository,
        SessionService sessionService,
        LoggingService loggingService,
        SendMessageService messageService,
        SendEmailService sendEmailService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
        this.messageService = messageService;
        this.sendEmailService = sendEmailService;
    }

    public async Task<SubmittedTicketsModel<TicketEmailModel>> ExecuteQuery(VoidTicketsQuery query)
    {
        try
        {
            var criteria = CreateCriteria(query);
            return await repository.SubmittedTickets<TicketEmailModel, VoidTicketsCriteria>(criteria, query.Tickets);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            var validation = new SubmittedTicketsValidation
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };

            return new SubmittedTicketsModel<TicketEmailModel>
            {
                Validation = validation,
                Tickets = Enumerable.Empty<TicketEmailModel>()
            };
        }
    }

    public VoidTicketsCriteria CreateCriteria(VoidTicketsQuery query)
    {
        var criteria = mapper.Map<VoidTicketsCriteria>(query);
        criteria.UserId = sessionService.UserId;
        criteria.UserPassword = query.UserPassword;
        criteria.Ip = sessionService.GetClientIp();
        return criteria;
    }

    public async Task SendMessage(VoidTicketsQuery ticketQuery, IEnumerable<TicketEmailModel> tickets)
    {
        ticketQuery.Message.CreatorId = sessionService.UserId;
        ticketQuery.Message.CreatorName = sessionService.UserName;
        var messageId = await messageService.InsertMessage(ticketQuery.Message, 0, ticketQuery.Match?.LeagueGroupId, false);
        await messageService.SendMessage(tickets, messageId, 0, ticketQuery.Message.CreatorId);
        await messageService.InsertMessageIntoAdminSite(ticketQuery.Message);
    }

    public async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery ticketQuery, IEnumerable<TicketEmailModel> tickets)
    {
        var model = mapper.Map<EmailVoidModel>(ticketQuery);
        return await sendEmailService.SendEmail(model, tickets.ToList());
    }
}