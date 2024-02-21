using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Criteria.SendMessage;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendMessage;

public interface SendMessageService
{
    Task<int> InsertMessageIdForBatchMessage(Message message, int matchId, int messageContentType);

    Task<int> InsertMessage(Message message, int matchId, int? leagueGroupId, bool isLikelyAbnormalBet);

    Task<int> InsertReason(string reasonEnglish, string reasonChineseSimplified);

    Task SendMessage(IEnumerable<TicketEmailModel> tickets, int messageId, int issueTypeId, int creatorId);

    Task InsertMessageIntoAdminSite(Message message);

    Task InsertVoidedTransaction(InsertVoidedTransactionParam parameter);

    Task InsertBatchMessage(int userId, string message);

    Task RemoveMessage(int userId, string transIds);

    Task DeleteTransaction(IEnumerable<BetId> betIds);
}

public class SendMessageServiceImp : SendMessageService
{
    private readonly IDynamicRepository repository;
    private readonly MessageItemService messageItemService;

    public SendMessageServiceImp(IDynamicRepository repository, MessageItemService messageItemService)
    {
        this.repository = repository;
        this.messageItemService = messageItemService;
    }

    public async Task<int> InsertMessageIdForBatchMessage(Message message, int matchId, int messageContentType)
    {
        return await InsertMessage(message, matchId, null, messageContentType);
    }

    public async Task<int> InsertMessage(Message message, int matchId, int? leagueGroupId, bool isLikelyAbnormalBet)
    {
        var messageContentType = Helper.GetMessageContentType(isLikelyAbnormalBet, message.ContentEnglish);

        return await InsertMessage(message, matchId, leagueGroupId, messageContentType);
    }

    private async Task<int> InsertMessage(Message message, int matchId, int? leagueGroupId, int messageContentType)
    {
        var criteria = new CreateMessageCriteria
        {
            MatchId = matchId,
            LeagueGroupId = leagueGroupId,
            Creator = message.CreatorId,
            CreatorName = message.CreatorName,
            Content_en = message.ContentEnglish.InsertSpace(),
            Content_ch = message.ContentChineseTraditional.InsertSpace(),
            Content_cs = message.ContentChineseSimplified.InsertSpace(),
            Content_zhcn = message.ContentNewChineseSimplified.InsertSpace(),
            Content_it = message.ContentItalian.InsertSpace(),
            Content_jp = message.ContentJapanese.InsertSpace(),
            Content_th = message.ContentThai.InsertSpace(),
            Content_ko = message.ContentKorean.InsertSpace(),
            Content_es = message.ContentSpanish.InsertSpace(),
            MsgContentsType = messageContentType
        };

        return await repository.GetAsync<int>(criteria);
    }

    public async Task<int> InsertReason(string reasonEnglish, string reasonChineseSimplified)
    {
        var criteria = new InsertReasonCommand
        {
            ReasonEnglish = reasonEnglish,
            ReasonChineseSimplified = reasonChineseSimplified
        };

        await repository.ExecuteAsync(criteria);
        return criteria.ReasonId;
    }

    public async Task SendMessage(IEnumerable<TicketEmailModel> tickets, int messageId, int issueTypeId, int creatorId)
    {
        var receivedUsers = GetListSendMessageDb(tickets);
        var messageXml = messageItemService.CreateMessageItems(receivedUsers, messageId);
        if (!string.IsNullOrWhiteSpace(messageXml))
        {
            await InsertBatchMessage(creatorId, messageXml);
        }
    }

    private static IEnumerable<ReceivedUser> GetListSendMessageDb<T>(IEnumerable<T> tickets) where T : SendMessageDbModel
    {
        return tickets.Select(item => new ReceivedUser
        {
            CustId = item.CustId,
            CustUserName = item.UserName,
            Recommend = item.Recommend,
            AgUserName = item.AgUserName,
            Mrecommend = item.Mrecommend,
            MagUserName = item.MagUserName,
            Srecommend = item.Srecommend,
            SagUserName = item.SagUserName,
            TransId = item.TransId
        });
    }

    public async Task InsertBatchMessage(int userId, string message)
    {
        var command = new SendMessageCommand
        {
            CreatorId = userId,
            XmlMessage = message
        };
        await repository.ExecuteAsync(command);
    }

    public async Task InsertMessageIntoAdminSite(Message message)
    {
        var command = new InsertMessageIntoAdminSiteCriteria
        {
            men = message.ContentEnglish,
            mch = message.ContentChineseTraditional,
            member = true,
            agent = true,
            ma = true,
            sma = true,
            creator = message.CreatorId
        };
        await repository.ExecuteAsync(command);
    }

    public async Task InsertVoidedTransaction(InsertVoidedTransactionParam parameter)
    {
        var criteria = new InsertVoidedTransactionCommand
        {
            MessageId = parameter.MessageId,
            ReasonId = parameter.ReasonId,
            IssueTypeId = parameter.IssueTypeId,
            SubIssueTypeId = parameter.SubIssueTypeId,
            TicketsXml = parameter.EmailTickets.CreateTicketsXml(parameter.IsAbnormalBet)
        };

        await repository.ExecuteAsync(criteria);
    }

    public async Task RemoveMessage(int userId, string transIds)
    {
        var command = new RemoveMessageCommand
        {
            UserId = userId,
            TransIds = transIds
        };
        await repository.ExecuteAsync(command);
    }

    public async Task DeleteTransaction(IEnumerable<BetId> betIds)
    {
        var command = new DeleteVoidedTransactionCommand
        {
            TicketsXml = betIds.CreateDeleteTransactionTicketsXml()
        };
        await repository.ExecuteAsync(command);
    }
}