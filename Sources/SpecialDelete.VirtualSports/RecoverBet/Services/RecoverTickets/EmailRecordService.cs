using AutoMapper;
using Fanex.MailDeliver.MailClient.Model;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

public interface EmailRecordService
{
    MailRecord Create(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group, Recover typeOfRecover);
}

public class EmailRecordServiceImp(
    IMapper mapper,
    SubjectService subjectService,
    TemplateEmailService templateEmailService,
    TicketService displayTicketService,
    PagingService pagingService)
    : EmailRecordService
{
    public MailRecord Create(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group, Recover typeOfRecover)
    {
        if (model.Valid())
        {
            var usersInSite = model.Tickets.Select(u => u.UserName).ToList();
            var negativeBalanceUsers = model.ViewModel.NegativeBalanceUsers;
            var negativeBalanceUsersInSite = negativeBalanceUsers.Intersected(usersInSite);
            model.ViewModel.Groups = CreateGroups(model.Tickets, typeOfRecover);
            model.ViewModel.NegativeBalanceUsers = negativeBalanceUsersInSite;
            var subject = subjectService.CreateRecover(model, group, RecoverType.VirtualSports);
            var mailRecord = templateEmailService.CreateForRecover(model, subject);
            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private List<Group<MailTicketViewModel>> CreateGroups(IEnumerable<RecoverTicketModel> tickets, Recover typeOfRecover)
    {
        var groups = pagingService.Groups(tickets, ticket => ticket.GroupName);

        return groups.Select(group => AssignTickets(group, typeOfRecover)).ToList();
    }

    private Group<MailTicketViewModel> AssignTickets(Group<RecoverTicketModel> group, Recover typeOfRecover)
    {
        var tickets = new List<MailTicketViewModel>();
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = displayTicketService.GetTicket(item, typeOfRecover);
            ticket.No = index++;
            var mailViewModel = mapper.Map<MailTicketViewModel>(ticket);
            mailViewModel.BetFrom = Helper.GetBetFrom(item.BetFrom);
            tickets.Add(mailViewModel);
        }

        return new Group<MailTicketViewModel> { Name = group.Name.ToUpperInvariant(), Tickets = tickets };
    }
}