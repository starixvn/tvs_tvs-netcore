using AutoMapper;
using Fanex.MailDeliver.Model;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

public interface EmailRecordService
{
    MailRecord Create(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group, Recover typeOfRecover);
}

public class EmailRecordServiceImp : EmailRecordService
{
    private readonly IMapper mapper;
    private readonly SubjectService subjectService;
    private readonly TemplateEmailService templateEmailService;
    private readonly TicketService displayTicketService;
    private readonly PagingService pagingService;

    public EmailRecordServiceImp(
        IMapper mapper,
        SubjectService subjectService,
        TemplateEmailService templateEmailService,
        TicketService displayTicketService,
        PagingService pagingService)
    {
        this.mapper = mapper;
        this.subjectService = subjectService;
        this.templateEmailService = templateEmailService;
        this.displayTicketService = displayTicketService;
        this.pagingService = pagingService;
    }

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
            var mailRecord = templateEmailService.Create(model, subject);
            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private List<Group<MailTicketViewModel>> CreateGroups(List<RecoverTicketModel> tickets, Recover typeOfRecover)
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