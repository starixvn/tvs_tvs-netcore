using AutoMapper;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.VoidByBetId.Services.VoidTickets;

public interface HandleService
{
    Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query);

    IEnumerable<Result> CreateWarningMessage(string warningCrickets);

    Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);

    Task<IEnumerable<Result>> SendEmail(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets);

    Task<Match> GetMatchInfo(int matchId, int type);
}

public class HandleServiceImp : HandleService
{
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly VoidByBetIdRepository repository;
    private readonly LoggingService loggingService;
    private readonly SendMessageService sendMessageService;
    private readonly SendEmailService sendEmailService;
    private readonly MatchService matchService;

    public HandleServiceImp(IMapper mapper,
        SessionService sessionService,
        VoidByBetIdRepository repository,
        SendMessageService sendMessageService,
        LoggingService loggingService,
        SendEmailService sendEmailService,
        MatchService matchService)
    {
        this.mapper = mapper;
        this.sessionService = sessionService;
        this.repository = repository;
        this.sendMessageService = sendMessageService;
        this.loggingService = loggingService;
        this.sendEmailService = sendEmailService;
        this.matchService = matchService;
    }

    public async Task<VoidTicketsModel> VoidTickets(VoidTicketsQuery query)
    {
        VoidTicketsModel model;
        try
        {
            model = await repository.VoidTickets(query);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);
            var validation = new VoidTicketValidation
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

    public IEnumerable<Result> CreateWarningMessage(string warningCrickets)
    {
        var results = new List<Result>();
        if (!string.IsNullOrEmpty(warningCrickets))
        {
            results.Add(new Result { ErrorCode = ErrorCode.ExecuteQueryAPIFail, ErrorMsg = warningCrickets });
        }

        return results;
    }

    public async Task SendMessage(VoidTicketsQuery query, IEnumerable<TicketEmailModel> tickets)
    {
        query.Message.CreatorId = sessionService.UserId;
        query.Message.CreatorName = sessionService.UserName;
        var isMessageContentAbnormal = query.IsAbnormalBet || !query.IsFilterByBetId;
        var messageId = await sendMessageService.InsertMessage(query.Message, 0, query.Match?.LeagueGroupId, isMessageContentAbnormal);
        var reasonId = await sendMessageService.InsertReason(query.Reason, query.ReasonSC);

        await sendMessageService.SendMessage(tickets, messageId, query.IssueTypeId, query.Message.CreatorId);
        if (!query.IsAbnormalBet)
        {
            await sendMessageService.InsertMessageIntoAdminSite(query.Message);
        }

        await sendMessageService.InsertVoidedTransaction(tickets, messageId, reasonId, query.IssueTypeId, query.SubIssueTypeId);
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

    public async Task<Match> GetMatchInfo(int matchId, int type)
    {
        var criteria = new GetMatchInfoCriteria
        {
            MatchId = matchId,
            Type = type
        };
        var match = await matchService.GetMatch(criteria);
        match = matchService.UpdateMatchInfoFromRemotingRef(match);
        return match;
    }
}