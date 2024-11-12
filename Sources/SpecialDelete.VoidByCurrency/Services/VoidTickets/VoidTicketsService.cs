using AutoMapper;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.VoidByCurrency.Services.VoidTickets;

public interface VoidTicketsService
{
    Task<VoidTicketsModel> ExecuteQuery(VoidTicketsQuery query);

    Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);

    Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, VoidTicketsModel model);
}

public class VoidTicketsServiceImp(
    IMapper mapper,
    VoidByCurrencyRepository repository,
    SendMessageByPlatformService sendMessageByPlatformService,
    LoggingService loggingService,
    SendEmailService sendEmailService)
    : VoidTicketsService
{
    public async Task<VoidTicketsModel> ExecuteQuery(VoidTicketsQuery query)
    {
        VoidTicketsModel model;
        try
        {
            model = await repository.VoidTickets(query);
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

        return model;
    }

    public async Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var param = new SendMessageTargetParam
        {
            EmailTickets = tickets,
            MatchId = query.MatchId,
            Match = query.Match,
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

    public async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var emailModel = mapper.Map<EmailVoidModel>(query);
        emailModel.NegativeBalanceUsers = model.Validation.NegativeBalanceUsers;
        return await sendEmailService.SendEmail(emailModel, model.Tickets);
    }
}