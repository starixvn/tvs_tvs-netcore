using AutoMapper;
using Fanex.MailDeliver.Model;
using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.Services.RenderTicket;
using SpecialDelete.RecoverBet.ViewModels;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Recover;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.RecoverBet.Services.RecoverTickets;

public class RecordService : RecordRecoverService<MailTicketViewModel, RecoverTicketModel>
{
    private readonly IMapper mapper;
    private readonly SubjectService subjectService;
    private readonly TemplateEmailService templateEmailService;
    private readonly ITicketService recoverTicketService;
    private readonly PagingService pagingService;

    public RecordService(IMapper mapper,
        SubjectService subjectService,
        TemplateEmailService templateEmailService,
        ITicketService recoverTicketService,
        PagingService pagingService)
    {
        this.mapper = mapper;
        this.subjectService = subjectService;
        this.templateEmailService = templateEmailService;
        this.recoverTicketService = recoverTicketService;
        this.pagingService = pagingService;
    }

    public MailRecord Create(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group)
    {
        if (model.Valid())
        {
            model.ViewModel.NegativeBalanceUsers = model.GetNegativeBalanceUsers(group, t => t.UserName);
            model.ViewModel.Groups = GenerateGroups(model.Tickets);
            var mailSubject = subjectService.CreateRecover(model, group, RecoverType.Default);
            var mailRecord = templateEmailService.CreateForRecover(model, mailSubject);
            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private List<Group<MailTicketViewModel>> GenerateGroups(List<RecoverTicketModel> tickets)
    {
        var groups = pagingService.Groups(tickets, ticket => ticket.Site);

        return groups.Select(AssignTickets).ToList();
    }

    private Group<MailTicketViewModel> AssignTickets(Group<RecoverTicketModel> group)
    {
        var tickets = new List<MailTicketViewModel>();
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = recoverTicketService.Render(item);
            ticket.No = index++;
            var mailTicket = mapper.Map<MailTicketViewModel>(ticket);
            mailTicket.BetFrom = Helper.GetBetFrom(item.BetFrom);
            mailTicket.Stake = mailTicket.Stake.Replace("Rebate", "(Rebate)");
            tickets.Add(mailTicket);
        }

        return new Group<MailTicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}