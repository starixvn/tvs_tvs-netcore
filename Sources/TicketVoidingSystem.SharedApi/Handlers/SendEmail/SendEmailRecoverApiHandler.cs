using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Recover;

namespace TicketVoidingSystem.SharedApi.Handlers.SendEmail;

public class SendEmailRecoverApiRequest : IRequest<IEnumerable<Result>>
{
    public string ActorUsername { get; set; }
    public string NegativeBalanceUsers { get; set; }
    public IEnumerable<TicketRecoverEmailModel> Tickets { get; set; }
}

public class SendEmailRecoverApiHandler : IRequestHandler<SendEmailRecoverApiRequest, IEnumerable<Result>>
{
    private readonly SendEmailRecoverService sendEmailRecoverService;

    public SendEmailRecoverApiHandler(SendEmailRecoverService sendEmailRecoverService)
    {
        this.sendEmailRecoverService = sendEmailRecoverService;
    }

    public async Task<IEnumerable<Result>> Handle(SendEmailRecoverApiRequest message, CancellationToken cancellationToken)
    {
        var emailModel = new MailRecoverViewModel
        {
            DateTime = DateTimeOffset.Now.DateTime,
            TemplatePath = TemplateEmailPath.RecoverBet,
            ActorUsername = message.ActorUsername,
            NegativeBalanceUsers = message.NegativeBalanceUsers
        };

        await sendEmailRecoverService.SendEmail(emailModel, message.Tickets);

        return new List<Result> { new() };
    }
}