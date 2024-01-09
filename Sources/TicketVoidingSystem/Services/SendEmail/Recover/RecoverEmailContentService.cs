using System.Collections.Generic;
using System.Linq;
using AutoMapper;
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
    private readonly IMapper mapper;
    private readonly SubjectService subjectService;
    private readonly TemplateEmailService templateEmailService;
    private readonly RecoverTicketService recoverTicketService;
    private readonly PagingService pagingService;

    public RecoverEmailContentServiceImp(IMapper mapper,
        SubjectService subjectService,
        TemplateEmailService templateEmailService,
        RecoverTicketService recoverTicketService,
        PagingService pagingService)
    {
        this.mapper = mapper;
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
        var groups = pagingService.Groups(tickets, ticket => ticket.Site);

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
            var mailTicket = mapper.Map<TicketRecoverEmailViewModel>(ticket);
            mailTicket.BetFrom = Helper.GetBetFrom(item.BetFrom);
            mailTicket.Stake = mailTicket.Stake.Replace("Rebate", "(Rebate)");
            tickets.Add(mailTicket);
        }

        return new Group<TicketRecoverEmailViewModel> { Name = group.Name, Tickets = tickets };
    }
}