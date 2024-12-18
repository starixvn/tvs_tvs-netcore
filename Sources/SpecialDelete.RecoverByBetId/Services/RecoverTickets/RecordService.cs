using AutoMapper;
using Fanex.MailDeliver.MailClient.Model;
using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.Services.GetTickets;
using SpecialDelete.RecoverByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverByBetId.Services.RecoverTickets;

public class RecordServiceImp(
    IMapper mapper,
    SubjectService subjectService,
    TemplateEmailService templateEmailService,
    TicketService ticketService,
    PagingService pagingService)
    : RecordRecoverService<MailTicketViewModel, RecoverTicketModel>
{
    public MailRecord Create(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group)
    {
        if (model.Valid())
        {
            model.ViewModel.NegativeBalanceUsers = model.GetNegativeBalanceUsers(group, t => t.UserName);
            model.ViewModel.Groups = CreateGroups(model.Tickets);
            var subject = subjectService.CreateRecover(model, group, RecoverType.Default);
            var mailRecord = templateEmailService.CreateForRecover(model, subject);
            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private List<Group<MailTicketViewModel>> CreateGroups(IEnumerable<RecoverTicketModel> tickets)
    {
        var groups = pagingService.Groups(tickets, ticket => ticket.GroupName);

        return groups.Select(AssignTickets).ToList();
    }

    private Group<MailTicketViewModel> AssignTickets(Group<RecoverTicketModel> group)
    {
        var tickets = new List<MailTicketViewModel>();
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = ticketService.GetTicket(item, ChoiceType.Email);
            ticket.No = index++;
            var mailTicket = mapper.Map<MailTicketViewModel>(ticket);
            mailTicket.BetFrom = Helper.GetBetFrom(item.BetFrom);
            tickets.Add(mailTicket);
        }

        return new Group<MailTicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}