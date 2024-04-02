using AutoMapper;
using Fanex.MailDeliver.MailClient.Model;
using SpecialDelete.CashOutTransaction.Common.Services;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using SpecialDelete.CashOutTransaction.RecoverTickets.Models;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.CashOutTransaction.RecoverTickets.Services;

public class RecordServiceImp : RecordRecoverService<MailTicketViewModel, RecoverTicketModel>
{
    private readonly IMapper mapper;
    private readonly SubjectService subjectService;
    private readonly TemplateEmailService templateEmailService;
    private readonly TicketHtmlService ticketHtmlService;
    private readonly PagingService pagingService;

    public RecordServiceImp(
        IMapper mapper,
        SubjectService subjectService,
        TemplateEmailService templateEmailService,
        TicketHtmlService ticketHtmlService,
        PagingService pagingService)
    {
        this.mapper = mapper;
        this.subjectService = subjectService;
        this.templateEmailService = templateEmailService;
        this.ticketHtmlService = ticketHtmlService;
        this.pagingService = pagingService;
    }

    public MailRecord Create(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group)
    {
        if (model.Valid())
        {
            model.ViewModel.NegativeBalanceUsers = model.GetNegativeBalanceUsers(group, t => t.UserName);
            model.ViewModel.Groups = CreateGroups(model.Tickets);
            var subject = subjectService.CreateRecover(model, group, RecoverType.CashOut);
            var mailRecord = templateEmailService.CreateForRecover(model, subject);
            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private List<Group<MailTicketViewModel>> CreateGroups(List<RecoverTicketModel> tickets)
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
            var ticket = ticketHtmlService.GetTicket(item);
            var mailTicket = mapper.Map<MailTicketViewModel>(ticket);
            mailTicket.No = index++;
            mailTicket.BetId = item.TransId;
            mailTicket.Member = item.UserName;
            mailTicket.BetFrom = Helper.GetBetFrom(item.BetFrom);
            tickets.Add(mailTicket);
        }

        return new Group<MailTicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}