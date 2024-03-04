using AutoMapper;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Void;
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
    private readonly Repository repository;
    private readonly LoggingService loggingService;
    private readonly SendMessageByPlatformService sendMessageByPlatformService;
    private readonly SendEmailService sendEmailService;

    public VoidTicketsServiceImp(
        IMapper mapper,
        Repository repository,
        LoggingService loggingService,
        SendMessageByPlatformService sendMessageByPlatformService,
        SendEmailService sendEmailService)
    {
        this.mapper = mapper;
        this.repository = repository;
        this.loggingService = loggingService;
        this.sendMessageByPlatformService = sendMessageByPlatformService;
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

    public async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, VoidTicketsModel model)
    {
        var emailModel = mapper.Map<EmailVoidModel>(query);
        emailModel.NegativeBalanceUsers = model.Validation.NegativeBalanceUsers;
        return await sendEmailService.SendEmail(emailModel, model.Tickets);
    }
}