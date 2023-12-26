using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpecialDelete.Common.SendEmail.Models;
using SpecialDelete.Common.SendEmail.Services;
using SpecialDelete.Common.SendEmail.ViewModels;
using SpecialDelete.Common.Services;
using SpecialDelete.Core.Constants;
using SpecialDelete.Core.DTO;
using SpecialDelete.Core.Resources;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.ViewModels;
using EmailSupport = SpecialDelete.RecoverParlayBet.Models.EmailSupport;

namespace SpecialDelete.RecoverParlayBet.Services.RecoverTickets;

public interface TicketsHandlerService<T, in TU> where T : EmailSupport where TU : RecoverMainTicketsQuery
{
    Task<(RecoverValidationModel Validation, IEnumerable<T> Tickets)> RecoverTickets(TU query);

    Result SendEmail(IEnumerable<T> tickets, string negativeBalanceUsers);

    Result WarningMessage(string settledMainTrainIds);
}

public class TicketsHandlerServiceImp<T, TU> : TicketsHandlerService<T, TU> where T : EmailSupport where TU : RecoverMainTicketsQuery
{
    private readonly ISessionService sessionService;
    private readonly SeparabilityService<T, TU> separabilityService;
    private readonly EmailRecoverService<MailTicketViewModel, T> emailService;

    public TicketsHandlerServiceImp(
        ISessionService sessionService,
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

    public Result SendEmail(IEnumerable<T> tickets, string negativeBalanceUsers)
    {
        var viewModel = CreateMailViewModel(negativeBalanceUsers);
        var sites = emailService.GetSites();
        var siteCsd = emailService.GetSiteByName(sites, Labels.CsdRecovery);
        var realTickets = tickets.Where(s => s.IsCsd).ToList();
        var csdRecoverModel = emailService.CreateMailModel(viewModel, siteCsd, realTickets);
        emailService.Send(csdRecoverModel, EmailGroup.Recover);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var itQaSite = emailService.GetSiteByName(sites, Labels.ItQa);
        var itQaTickets = tickets.Where(s => s.IsItQa).ToList();
        var itQaModel = emailService.CreateMailModel(viewModel, itQaSite, itQaTickets);
        emailService.Send(itQaModel, EmailGroup.ItQa);

        viewModel.NegativeBalanceUsers = negativeBalanceUsers;
        var itSupportSite = emailService.GetSiteByName(sites, Labels.ItSupport);
        var itSupportTickets = tickets.Where(s => s.IsItSupport).ToList();
        var itSupportModel = emailService.CreateMailModel(viewModel, itSupportSite, itSupportTickets);
        emailService.Send(itSupportModel, EmailGroup.ItSupport);

        return new Result { ErrorMsg = Messages.RecoverBetSuccessfully };
    }

    private MailRecoverViewModel<MailTicketViewModel> CreateMailViewModel(string negativeBalanceUsers)
    {
        return new MailRecoverViewModel<MailTicketViewModel>
        {
            ActorUsername = sessionService.UserName,
            NegativeBalanceUsers = negativeBalanceUsers,
            DateTime = DateTimeOffset.Now.DateTime,
            TemplatePath = TemplateName.RecoverParlayBet
        };
    }

    public Result WarningMessage(string settledMainTrainIds)
    {
        return separabilityService.WarningMessage(settledMainTrainIds);
    }
}