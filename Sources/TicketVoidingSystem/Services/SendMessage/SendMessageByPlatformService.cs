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

public class SendMessageByPlatformServiceImp(
    SpecialPlatformService specialPlatformService,
    SendMessageService sendMessageService,
    SessionService sessionService)
    : SendMessageByPlatformService
{
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
        if (!normalTickets.Any())
        {
            return 0;
        }

        var normalMessageId = await sendMessageService.InsertMessage(param.Message, param.MatchId, param.Match?.LeagueGroupId, param.IsMessageContentAbnormal);
        await sendMessageService.SendMessage(normalTickets, normalMessageId, param.IssueTypeId, param.Message.CreatorId);
        return normalMessageId;
    }

    private async Task<int> SendMessageForSpecialPlatform(IEnumerable<TicketEmailModel> specialPlatformTickets, SendMessageTargetParam param)
    {
        if (!specialPlatformTickets.Any())
        {
            return 0;
        }

        var specialMessage = specialPlatformService.RemoveSabaInMessageContent(param.Match, param.Message);
        var specialMessageId = await sendMessageService.InsertMessage(specialMessage, 0, param.Match?.LeagueGroupId, param.IsMessageContentAbnormal);
        await sendMessageService.SendMessage(specialPlatformTickets, specialMessageId, param.IssueTypeId, specialMessage.CreatorId);
        return specialMessageId;
    }

    private async Task InsertVoidedTransactionForNormalTickets(IEnumerable<TicketEmailModel> normalTickets, int normalMessageId, int reasonId, SendMessageTargetParam param)
    {
        if (normalTickets.Any() && normalMessageId > 0)
        {
            await sendMessageService.InsertVoidedTransaction(new InsertVoidedTransactionParam
            {
                EmailTickets = normalTickets,
                MessageId = normalMessageId,
                ReasonId = reasonId,
                IssueTypeId = param.IssueTypeId,
                SubIssueTypeId = param.SubIssueTypeId,
                IsAbnormalBet = !param.IsSendMessageToAdminSite
            });
        }
    }

    private async Task InsertVoidedTransactionForSpecialTickets(IEnumerable<TicketEmailModel> specialPlatformTickets, int specialMessageId, int reasonId, SendMessageTargetParam param)
    {
        if (specialPlatformTickets.Any() && specialMessageId > 0)
        {
            await sendMessageService.InsertVoidedTransaction(new InsertVoidedTransactionParam
            {
                EmailTickets = specialPlatformTickets,
                MessageId = specialMessageId,
                ReasonId = reasonId,
                IssueTypeId = param.IssueTypeId,
                SubIssueTypeId = param.SubIssueTypeId,
                IsAbnormalBet = !param.IsSendMessageToAdminSite
            });
        }
    }
}