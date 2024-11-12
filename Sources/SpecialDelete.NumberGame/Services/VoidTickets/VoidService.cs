using AutoMapper;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.NumberGame.Services.VoidTickets;

public interface VoidService
{
    Task<(IEnumerable<TicketEmailModel> Tickets, Result Validation)> VoidTickets(VoidTicketsQuery query);

    Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);

    Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);
}

public class VoidServiceImp(
    IMapper mapper,
    Repository repository,
    LoggingService loggingService,
    SendMessageByPlatformService sendMessageByPlatformService,
    SendEmailService sendEmailService)
    : VoidService
{
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
        var param = new SendMessageTargetParam
        {
            EmailTickets = tickets,
            MatchId = query.MatchId ?? 0,
            Match = null,
            Message = query.Message,
            IsMessageContentAbnormal = false,
            Reason = query.Reason,
            ReasonSC = query.ReasonSC,
            IssueTypeId = 0,
            SubIssueTypeId = 0,
            IsSendMessageToAdminSite = true
        };

        await sendMessageByPlatformService.Execute(param);
    }

    public async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var emailModel = mapper.Map<EmailVoidModel>(query);
        return await sendEmailService.SendEmail(emailModel, tickets.ToList());
    }
}