using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.Services.SendMessage;

public interface SendMessageByPlatformService
{
    Task Execute(SendMessageTargetParam param);
}

public class SendMessageByPlatformServiceImp : SendMessageByPlatformService
{
    private readonly SpecialPlatformService specialPlatformService;
    private readonly SendMessageService sendMessageService;
    private readonly SessionService sessionService;

    public SendMessageByPlatformServiceImp(SpecialPlatformService specialPlatformService, SendMessageService sendMessageService, SessionService sessionService)
    {
        this.specialPlatformService = specialPlatformService;
        this.sendMessageService = sendMessageService;
        this.sessionService = sessionService;
    }

    public async Task Execute(SendMessageTargetParam param)
    {
        param.Message.CreatorId = sessionService.UserId;
        param.Message.CreatorName = sessionService.UserName;

        var (normalTickets, specialPlatformTickets) = specialPlatformService.GroupTicketSaba(param.EmailTickets);
        var normalMessageId = await SendMessageForNormalPlatform(normalTickets, param);
        var specialMessageId = await SendMessageForSpecialPlatform(specialPlatformTickets, param);

        var reasonId = await sendMessageService.InsertReason(param.Reason, param.ReasonSC);
        await InsertVoidedTransactionForNormalTickets(normalTickets, normalMessageId, reasonId, param);
        await InsertVoidedTransactionForSpecialTickets(specialPlatformTickets, specialMessageId, reasonId, param);

        if (param.IsSendMessageToAdminSite)
        {
            await sendMessageService.InsertMessageIntoAdminSite(param.Message);
        }
    }

    private async Task<int> SendMessageForNormalPlatform(IEnumerable<TicketEmailModel> normalTickets, SendMessageTargetParam param)
    {
        if (normalTickets.Any())
        {
            var normalMessageId = await sendMessageService.InsertMessage(param.Message, param.MatchId, param.Match?.LeagueGroupId, param.IsMessageContentAbnormal);
            await sendMessageService.SendMessage(normalTickets, normalMessageId, param.IssueTypeId, param.Message.CreatorId);
            return normalMessageId;
        }

        return 0;
    }

    private async Task<int> SendMessageForSpecialPlatform(IEnumerable<TicketEmailModel> specialPlatformTickets, SendMessageTargetParam param)
    {
        if (specialPlatformTickets.Any())
        {
            var specialMessage = specialPlatformService.RemoveSabaInMessageContent(param.Match, param.Message);
            var specialMessageId = await sendMessageService.InsertMessage(specialMessage, param.MatchId, param.Match?.LeagueGroupId, param.IsMessageContentAbnormal);
            await sendMessageService.SendMessage(specialPlatformTickets, specialMessageId, param.IssueTypeId, specialMessage.CreatorId);
            return specialMessageId;
        }

        return 0;
    }

    private async Task InsertVoidedTransactionForNormalTickets(IEnumerable<TicketEmailModel> normalTickets, int normalMessageId, int reasonId, SendMessageTargetParam param)
    {
        if (normalTickets.Any() && normalMessageId > 0)
        {
            await sendMessageService.InsertVoidedTransaction(normalTickets, normalMessageId, reasonId, param.IssueTypeId, param.SubIssueTypeId);
        }
    }

    private async Task InsertVoidedTransactionForSpecialTickets(IEnumerable<TicketEmailModel> specialPlatformTickets, int specialMessageId, int reasonId, SendMessageTargetParam param)
    {
        if (specialPlatformTickets.Any() && specialMessageId > 0)
        {
            await sendMessageService.InsertVoidedTransaction(specialPlatformTickets, specialMessageId, reasonId, param.IssueTypeId, param.SubIssueTypeId);
        }
    }
}