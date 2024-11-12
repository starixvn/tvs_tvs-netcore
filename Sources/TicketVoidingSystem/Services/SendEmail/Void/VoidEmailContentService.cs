using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.MailDeliver.MailClient.Model;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail.Subject;
using static TicketVoidingSystem.Utilities.Helper;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface VoidEmailContentService
{
    Task<MailRecord> Create(MailVoidViewModel mailVoidViewModel, SiteEmail site, IEnumerable<TicketEmailModel> tickets,
        EmailGroup group, bool isFromAfterVoidService);
}

public class VoidEmailContentServiceImp(
    IDynamicRepository repository,
    TicketService ticketService,
    SubjectService subjectService,
    TemplateEmailService templateEmailService)
    : VoidEmailContentService
{
    public async Task<MailRecord> Create(MailVoidViewModel mailVoidViewModel, SiteEmail site, IEnumerable<TicketEmailModel> tickets, EmailGroup group, bool isFromAfterVoidService)
    {
        if (tickets.Valid(site))
        {
            var transformGroupTickets = await AssignGroupTickets(mailVoidViewModel, tickets, isFromAfterVoidService);
            var voidType = IsAbnormalBet(mailVoidViewModel.IssueTypeId)
                           || IsAbnormalAccount(mailVoidViewModel.IssueTypeId)
                           || mailVoidViewModel.IsFilterByUserName
                ? VoidType.Abnormal : VoidType.None;
            var subject = subjectService.CreateVoid(mailVoidViewModel, tickets.Select(x => x.Site), site, group, voidType);
            var mailVoidModelClone = mailVoidViewModel.DeepClone();
            mailVoidModelClone.NegativeBalanceUsers = tickets.GetNegativeBalanceUsers(group, t => t.UserName, mailVoidViewModel.NegativeBalanceUsers);
            mailVoidModelClone.GroupTickets = transformGroupTickets;
            var mailRecord = templateEmailService.Create(mailVoidModelClone, site, subject);

            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private async Task<IList<Group<TicketEmailViewModel>>> AssignGroupTickets(MailVoidViewModel mailVoidViewModel, IEnumerable<TicketEmailModel> tickets, bool isFromAfterVoidService)
    {
        var groups = new List<Group<TicketEmailViewModel>>();
        var issueTypesHasCancelCO = new List<int>
        {
            IssueTypeConstant.DangerAccepted, IssueTypeConstant.RedCard, IssueTypeConstant.WrongScore,
            IssueTypeConstant.WrongMarketOffered, IssueTypeConstant.TechnicalError, IssueTypeConstant.WrongOddsSportsBook
        };
        if (issueTypesHasCancelCO.Exists(x => x == mailVoidViewModel.IssueTypeId))
        {
            var voidTickets = tickets.Where(x => !x.IsCancelCashOut).ToList();
            var cancelCashOutTickets = tickets.Where(x => x.IsCancelCashOut).ToList();

            if (voidTickets.Any())
            {
                await AddTicketToGroup(groups, voidTickets, mailVoidViewModel.Match,
                    isFromAfterVoidService, StringResource.ListOfVoidedTickets);
            }

            if (cancelCashOutTickets.Any())
            {
                await AddTicketToGroup(groups, cancelCashOutTickets, mailVoidViewModel.Match,
                    isFromAfterVoidService, StringResource.ListOfCancelledCashOutTickets);
            }
        }
        else
        {
            await AddTicketToGroup(groups, tickets, mailVoidViewModel.Match,
                isFromAfterVoidService, StringResource.ListOfVoidedTickets);
        }

        return groups;
    }

    private async Task AddTicketToGroup(ICollection<Group<TicketEmailViewModel>> groups,
        IEnumerable<TicketEmailModel> tickets, Match match, bool isFromAfterVoidService,
        string groupName)
    {
        var groupVoidTicket = new Group<TicketEmailViewModel>
        {
            Tickets = await AssignTickets(tickets, match, isFromAfterVoidService),
            Name = groupName
        };

        groups.Add(groupVoidTicket);
    }

    private async Task<IEnumerable<TicketEmailViewModel>> AssignTickets(IEnumerable<TicketEmailModel> tickets, Match match, bool isFromAfterVoidService)
    {
        var ticketsViewModel = new List<TicketEmailViewModel>();
        var index = 1;
        var operators = await GetOperators(tickets);
        foreach (var item in tickets)
        {
            item.OperatorID = operators.FirstOrDefault(x => x.AgentId == item.Recommend)?.OperatorID;
            var ticket = ticketService.GetTicket(item, match, isFromAfterVoidService);
            ticket.No = index++;
            ticketsViewModel.Add(ticket);
        }

        return ticketsViewModel;
    }

    private async Task<IEnumerable<GetOperatorInfoModel>> GetOperators(IEnumerable<TicketEmailModel> ticketModels)
    {
        var criteria = new GetOperatorInfoCriteria { AgentIdsXml = ticketModels.Select(x => x.Recommend).Distinct().ToOperatorsXml() };
        return await repository.FetchAsync<GetOperatorInfoModel>(criteria);
    }
}