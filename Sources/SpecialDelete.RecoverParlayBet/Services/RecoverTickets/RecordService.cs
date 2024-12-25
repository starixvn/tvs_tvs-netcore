using AutoMapper;
using Fanex.MailDeliver.MailClient.Model;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Services.GetTickets;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverParlayBet.Services.RecoverTickets;

public class RecordServiceImp<T>(
    IMapper mapper,
    SubjectService subjectService,
    TemplateEmailService templateEmailService,
    DisplayedTicketService<T> displayedTicketService,
    PagingService pagingService)
    : RecordRecoverService<MailTicketViewModel, T>
    where T : GetMainTicket
{
    public MailRecord Create(MailRecoverModel<MailTicketViewModel, T> model, EmailGroup group)
    {
        if (!model.Valid())
        {
            return new MailRecord();
        }

        model.ViewModel.NegativeBalanceUsers = model.GetNegativeBalanceUsers(group, t => t.Username);
        model.ViewModel.Groups = CreateGroups(model.Tickets);
        var subject = subjectService.CreateRecover(model, group, RecoverType.Parlay);
        var mailRecord = templateEmailService.CreateForRecover(model, subject);
        return mailRecord.MailRecord;

    }

    private List<Group<MailTicketViewModel>> CreateGroups(IEnumerable<T> tickets)
    {
        var groups = pagingService.Groups(tickets, ticket => ticket.GroupName);

        return groups.Select(AssignTickets).ToList();
    }

    private Group<MailTicketViewModel> AssignTickets(Group<T> group)
    {
        var tickets = new List<MailTicketViewModel>();
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = displayedTicketService.Map(item, false);
            var mailTicket = mapper.Map<MailTicketViewModel>(ticket);
            mailTicket.No = index++;
            mailTicket.BetFrom = Helper.GetBetFrom(item.BetFrom);
            tickets.Add(mailTicket);
        }

        return new Group<MailTicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}