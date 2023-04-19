using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.MailDeliver.Model;
using Force.DeepCloner;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface VoidEmailContentService
{
    Task<MailRecord> Create(MailVoidViewModel mailVoidViewModel, SiteEmail site, IEnumerable<TicketEmailModel> tickets,
        EmailGroup group, bool isFromAfterVoidService);
}

public class VoidEmailContentServiceImp : VoidEmailContentService
{
    private readonly TicketService ticketService;
    private readonly SubjectService subjectService;
    private readonly TemplateEmailService templateEmailService;
    private readonly IDynamicRepository repository;

    public VoidEmailContentServiceImp(IDynamicRepository repository, TicketService ticketService, SubjectService subjectService, TemplateEmailService templateEmailService)
    {
        this.repository = repository;
        this.ticketService = ticketService;
        this.subjectService = subjectService;
        this.templateEmailService = templateEmailService;
    }

    public async Task<MailRecord> Create(MailVoidViewModel mailVoidViewModel, SiteEmail site, IEnumerable<TicketEmailModel> tickets, EmailGroup group, bool isFromAfterVoidService)
    {
        if (tickets.Valid(site))
        {
            var transformTickets = await AssignTickets(tickets, mailVoidViewModel.Match, site, isFromAfterVoidService);
            var voidType = mailVoidViewModel.IsLikelyAbnormalBet || mailVoidViewModel.IsAbnormalAccount
                                                                 || mailVoidViewModel.IsFilterByUserName ? VoidType.Abnormal : VoidType.None;
            var subject = subjectService.CreateVoid(mailVoidViewModel, tickets, site, group, voidType);
            var mailVoidModelClone = mailVoidViewModel.DeepClone();
            mailVoidModelClone.NegativeBalanceUsers = tickets.GetNegativeBalanceUsers(group, t => t.UserName, mailVoidViewModel.NegativeBalanceUsers);
            var mailRecord = templateEmailService.Create(mailVoidModelClone, transformTickets, site, subject);

            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private async Task<IEnumerable<TicketEmailViewModel>> AssignTickets(IEnumerable<TicketEmailModel> ticketModels, Match match, SiteEmail site, bool isFromAfterVoidService)
    {
        var tickets = new List<TicketEmailViewModel>();
        var index = 1;
        var operators = await GetOperators(ticketModels);
        foreach (var item in ticketModels)
        {
            item.OperatorID = operators.FirstOrDefault(x => x.AgentId == item.Recommend)?.OperatorID;
            var ticket = ticketService.GetTicket(item, match, site, isFromAfterVoidService);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return tickets;
    }

    private async Task<IEnumerable<GetOperatorInfoModel>> GetOperators(IEnumerable<TicketEmailModel> ticketModels)
    {
        var criteria = new GetOperatorInfoCriteria { AgentIdsXml = ticketModels.Select(x => x.Recommend).Distinct().ToOperatorsXml() };
        return await repository.FetchAsync<GetOperatorInfoModel>(criteria);
    }
}