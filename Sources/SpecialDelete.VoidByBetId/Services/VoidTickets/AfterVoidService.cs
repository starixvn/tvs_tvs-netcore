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

public class AfterVoidServiceImp(
    IMapper mapper,
    SendMessageByPlatformService sendMessageByPlatformService,
    SendEmailService sendEmailService,
    LetstalkService letstalkService)
    : AfterVoidService
{
    public async Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var param = new SendMessageTargetParam
        {
            EmailTickets = tickets,
            MatchId = 0,
            Match = query.Match,
            Message = query.Message,
            IsMessageContentAbnormal = query.AbnormalBetType != null || !query.IsFilterByBetId,
            Reason = query.Reason,
            ReasonSC = query.ReasonSC,
            IssueTypeId = query.IssueTypeId,
            SubIssueTypeId = query.SubIssueTypeId,
            IsSendMessageToAdminSite = !IsAbnormalBet(query.AbnormalBetType)
        };
        await sendMessageByPlatformService.Execute(param);
    }

    public async Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        var emailModel = mapper.Map<EmailVoidModel>(query);
        emailModel.IsFilterByUsername = !query.IsFilterByBetId;
        if (IsAbnormalBet(query.AbnormalBetType))
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

    public bool IsAbnormalBet(byte? abnormalBetType)
    {
        const byte AbnormalBetSingle = 0;
        const byte AbnormalBetMainParlay = 1;

        return abnormalBetType is AbnormalBetSingle or AbnormalBetMainParlay;
    }
}