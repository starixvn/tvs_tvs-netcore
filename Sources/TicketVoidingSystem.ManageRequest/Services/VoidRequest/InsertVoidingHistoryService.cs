using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface InsertVoidingHistoryService
{
    Task<int> InsertVoidingHistory(InsertQueueQuery query, int siteDbGroupId, string broadcastSessionId);
}

public class InsertVoidingHistoryServiceImp : InsertVoidingHistoryService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;

    public InsertVoidingHistoryServiceImp(
        IDynamicRepository repository,
        SessionService sessionService,
        LoggingService loggingService
    )
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.loggingService = loggingService;
    }

    public async Task<int> InsertVoidingHistory(InsertQueueQuery query, int siteDbGroupId, string broadcastSessionId)
    {
        var command = new InsertVoidingHistoryCriteria
        {
            RequestIds = query.RequestId.ToString(),
            UserId = sessionService.UserId,
            SiteDbGroupId = siteDbGroupId,
            BroadcastSessionId = broadcastSessionId,
            VoidData = CreateVoidDataXmlModel(query).ToXml()
        };

        await loggingService.InfoAsync($"InsertVoidingHistory: {JsonSerializer.Serialize(command)}");
        var model = await repository.GetAsync<VoidingHistoryModel>(command);

        return model.VoidingHistoryId;
    }

    private VoidDataXmlModel CreateVoidDataXmlModel(InsertQueueQuery query)
    {
        var voidData = new VoidDataXmlModel
        {
            Reason = query.Reason,
            ReasonSC = query.ReasonSC,
            CreatorId = sessionService.UserId,
            CreatorName = sessionService.UserName,
            DecidedBy = query.DecidedBy,
            VoidFromTime = query.VoidFromTime,
            VoidToTime = query.VoidToTime,
            VoidFromDate = query.VoidFromDate,
            VoidToDate = query.VoidToDate,
            IssueTypeId = query.IssueTypeId,
            SubIssueTypeId = query.SubIssueTypeId,
            SubIssueTypeName = query.SubIssueTypeName,
            SubIssueTypeNameCS = query.SubIssueTypeNameCS,
            IsHasSettledTicket = query.IsHasSettledTicket
        };

        if (query.Message != null)
        {
            voidData.ContentChineseTraditional = query.Message.ContentChineseTraditional;
            voidData.ContentChineseSimplified = query.Message.ContentChineseSimplified;
            voidData.ContentNewChineseSimplified = query.Message.ContentNewChineseSimplified;
            voidData.ContentEnglish = query.Message.ContentEnglish;
            voidData.ContentSpanish = query.Message.ContentSpanish;
            voidData.ContentItalian = query.Message.ContentItalian;
            voidData.ContentJapanese = query.Message.ContentJapanese;
            voidData.ContentKorean = query.Message.ContentKorean;
            voidData.ContentThai = query.Message.ContentThai;
        }

        return voidData;
    }
}