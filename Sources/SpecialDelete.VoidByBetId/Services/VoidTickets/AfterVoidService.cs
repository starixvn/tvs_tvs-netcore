using AutoMapper;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.VoidByBetId.Services.VoidTickets;

public interface AfterVoidService
{
    Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);

    Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);

    Task<IEnumerable<Result>> SendLetstalk(VoidTicketsQuery query, VoidTicketsModel model);
}

public class AfterVoidServiceImp : AfterVoidService
{
    private readonly IMapper mapper;
    private readonly SendMessageByPlatformService sendMessageByPlatformService;
    private readonly SendEmailService sendEmailService;
    private readonly LetstalkService letstalkService;

    public AfterVoidServiceImp(IMapper mapper,
        SendMessageByPlatformService sendMessageByPlatformService,
        SendEmailService sendEmailService,
        LetstalkService letstalkService)
    {
        this.mapper = mapper;
        this.sendMessageByPlatformService = sendMessageByPlatformService;
        this.sendEmailService = sendEmailService;
        this.letstalkService = letstalkService;
    }

    public async Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var param = new SendMessageTargetParam
        {
            EmailTickets = tickets,
            MatchId = 0,
            Match = query.Match,
            Message = query.Message,
            IsMessageContentAbnormal = query.IsAbnormalBet || !query.IsFilterByBetId,
            Reason = query.Reason,
            ReasonSC = query.ReasonSC,
            IssueTypeId = query.IssueTypeId,
            SubIssueTypeId = query.SubIssueTypeId,
            IsSendMessageToAdminSite = !query.IsAbnormalBet
        };
        await sendMessageByPlatformService.Execute(param);
    }

    public async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var emailModel = mapper.Map<EmailVoidModel>(query);
        emailModel.IsFilterByUsername = !query.IsFilterByBetId;
        if (query.IsAbnormalBet)
        {
            emailModel.Reason = $"{emailModel.Reason}({query.SubIssueTypeName})";
            emailModel.ReasonSC = $"{emailModel.ReasonSC}({query.SubIssueTypeNameCS})";
        }

        return await sendEmailService.SendEmail(emailModel, tickets);
    }

    public async Task<IEnumerable<Result>> SendLetstalk(VoidTicketsQuery query, VoidTicketsModel model)
    {
        return await letstalkService.Send(query, model);
    }
}