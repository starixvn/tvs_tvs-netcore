using System.Collections.Generic;
using System.Linq;
using Fanex.MailDeliver.Model;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail.Recover;

public interface RecoverEmailContentService
{
    MailRecord Create(MailRecoverViewModel viewModel, IEnumerable<TicketRecoverEmailModel> tickets, SiteEmail siteEmail, EmailGroup group);
}

public class RecoverEmailContentServiceImp : RecoverEmailContentService
{
    private readonly SubjectService subjectService;
    private readonly TemplateEmailService templateEmailService;
    private readonly RecoverTicketService recoverTicketService;
    private readonly PagingService pagingService;

    public RecoverEmailContentServiceImp(SubjectService subjectService, TemplateEmailService templateEmailService,
        RecoverTicketService recoverTicketService, PagingService pagingService)
    {
        this.subjectService = subjectService;
        this.templateEmailService = templateEmailService;
        this.recoverTicketService = recoverTicketService;
        this.pagingService = pagingService;
    }

    public MailRecord Create(MailRecoverViewModel viewModel, IEnumerable<TicketRecoverEmailModel> tickets, SiteEmail siteEmail, EmailGroup group)
    {
        if (tickets.Valid(siteEmail))
        {
            viewModel.NegativeBalanceUsers = tickets.GetNegativeBalanceUsers(group, t => t.UserName, viewModel.NegativeBalanceUsers);
            viewModel.GroupTickets = GenerateGroups(tickets);
            var mailSubject = subjectService.CreateRecover(viewModel, group, RecoverType.Default);
            var mailRecord = templateEmailService.CreateForRecover(viewModel, siteEmail, mailSubject);
            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private List<Group<TicketRecoverEmailViewModel>> GenerateGroups(IEnumerable<TicketRecoverEmailModel> tickets)
    {
        var groups = pagingService.Groups(tickets, ticket => ticket.GroupName);

        return groups.Select(MapToViewModelTickets).ToList();
    }

    private Group<TicketRecoverEmailViewModel> MapToViewModelTickets(Group<TicketRecoverEmailModel> group)
    {
        var tickets = new List<TicketRecoverEmailViewModel>();
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = recoverTicketService.Render(item);
            ticket.No = index++;
            ticket.BetFrom = Helper.GetBetFrom(item.BetFrom);
            ticket.Stake = ticket.Stake.Replace("Rebate", "(Rebate)");
            tickets.Add(ticket);
        }

        return new Group<TicketRecoverEmailViewModel> { Name = group.Name, Tickets = tickets };
    }
}