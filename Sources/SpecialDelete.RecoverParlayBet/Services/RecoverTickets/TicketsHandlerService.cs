using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail.Recover;
using EmailSupport = SpecialDelete.RecoverParlayBet.Models.EmailSupport;

namespace SpecialDelete.RecoverParlayBet.Services.RecoverTickets;

public interface TicketsHandlerService<T, in TU> where T : EmailSupport where TU : RecoverMainTicketsQuery
{
    Task<(RecoverValidationModel Validation, IEnumerable<T> Tickets)> RecoverTickets(TU query);

    Task<Result> SendEmail(IEnumerable<T> tickets, string negativeBalanceUsers);

    Result WarningMessage(string settledMainTrainIds);
}

public class TicketsHandlerServiceImp<T, TU> : TicketsHandlerService<T, TU> where T : EmailSupport where TU : RecoverMainTicketsQuery
{
    private readonly SessionService sessionService;
    private readonly SeparabilityService<T, TU> separabilityService;
    private readonly EmailRecoverService<MailTicketViewModel, T> emailService;

    public TicketsHandlerServiceImp(
        SessionService sessionService,
        SeparabilityService<T, TU> separabilityService,
        EmailRecoverService<MailTicketViewModel, T> emailService)
    {
        this.sessionService = sessionService;
        this.separabilityService = separabilityService;
        this.emailService = emailService;
    }

    public async Task<(RecoverValidationModel Validation, IEnumerable<T> Tickets)> RecoverTickets(TU query)
    {
        return await separabilityService.RecoverTickets(query);
    }

    public async Task<Result> SendEmail(IEnumerable<T> tickets, string negativeBalanceUsers)
    {
        var viewModel = CreateMailViewModel(negativeBalanceUsers);
        var sites = await emailService.GetSites();
        var siteCsd = emailService.GetSiteByName(sites, StringResource.CsdRecovery);
        var realTickets = tickets.Where(s => s.IsCsd).ToList();
        var csdRecoverModel = emailService.CreateMailModel(viewModel, siteCsd, realTickets);
        emailService.Send(csdRecoverModel, EmailGroup.Recover);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var itQaSite = emailService.GetSiteByName(sites, StringResource.ItQa);
        var itQaTickets = tickets.Where(s => s.IsItQa).ToList();
        var itQaModel = emailService.CreateMailModel(viewModel, itQaSite, itQaTickets);
        emailService.Send(itQaModel, EmailGroup.ItQa);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var itSupportSite = emailService.GetSiteByName(sites, StringResource.ItSupport);
        var itSupportTickets = tickets.Where(s => s.IsItSupport).ToList();
        var itSupportModel = emailService.CreateMailModel(viewModel, itSupportSite, itSupportTickets);
        emailService.Send(itSupportModel, EmailGroup.ItSupport);

        return new Result { ErrorMsg = StringResource.RecoverBetSuccessfully };
    }

    private MailRecoverViewModel<MailTicketViewModel> CreateMailViewModel(string negativeBalanceUsers)
    {
        return new MailRecoverViewModel<MailTicketViewModel>
        {
            ActorUsername = sessionService.UserName,
            NegativeBalanceUsers = negativeBalanceUsers,
            DateTime = DateTimeOffset.Now.DateTime,
            TemplatePath = TemplateEmailPath.RecoverParlayBet
        };
    }

    public Result WarningMessage(string settledMainTrainIds)
    {
        return separabilityService.WarningMessage(settledMainTrainIds);
    }
}