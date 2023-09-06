using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Handlers.SendEmail;

public class SendEmailApiRequest : IRequest<IEnumerable<Result>>
{
    public Match Match { get; set; }
    public VoidedReason VoidedReason { get; set; }
    public Message Message { get; set; }
    public int IssueTypeId { get; set; }
    public string NegativeBalanceUsers { get; set; }
    public IEnumerable<TicketEmailModel> EmailTickets { get; set; }
}

public class SendEmailApiHandler : IRequestHandler<SendEmailApiRequest, IEnumerable<Result>>
{
    private readonly SendEmailService sendEmailService;

    public SendEmailApiHandler(SendEmailService sendEmailService)
    {
        this.sendEmailService = sendEmailService;
    }

    public async Task<IEnumerable<Result>> Handle(SendEmailApiRequest message, CancellationToken cancellationToken)
    {
        var emailModel = new EmailVoidModel
        {
            Match = message.Match,
            Message = message.Message,
            IssueTypeId = message.IssueTypeId,
            NegativeBalanceUsers = message.NegativeBalanceUsers,
            Reason = message.VoidedReason.ReasonEnglish,
            ReasonSC = message.VoidedReason.ReasonChineseSimplified
        };

        return await sendEmailService.SendEmail(emailModel, message.EmailTickets.ToList(), true);
    }
}