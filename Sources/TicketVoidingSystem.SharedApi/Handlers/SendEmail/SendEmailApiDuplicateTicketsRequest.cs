using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;

namespace TicketVoidingSystem.SharedApi.Handlers.SendEmail;

public class SendEmailApiDuplicateTicketsRequest : IRequest<IEnumerable<Result>>
{
    public Message Message { get; set; }

    public int IssueTypeId { get; set; }

    public int RequestId { get; set; }

    public int? FilterBy { get; set; }

    public int SportType { get; set; }

    public int VoidingHistoryId { get; set; }
}

public class SendEmailApiDuplicateTicketsHandler : IRequestHandler<SendEmailApiDuplicateTicketsRequest, IEnumerable<Result>>
{
    private readonly SendEmailDuplicateTicketsService sendEmailService;

    public SendEmailApiDuplicateTicketsHandler(SendEmailDuplicateTicketsService sendEmailService)
    {
        this.sendEmailService = sendEmailService;
    }

    public async Task<IEnumerable<Result>> Handle(SendEmailApiDuplicateTicketsRequest message, CancellationToken cancellationToken)
    {
        var emailModel = new EmailVoidModel
        {
            Message = message.Message,
            IssueTypeId = message.IssueTypeId,
            RequestId = message.RequestId,
            FilterBy = message.FilterBy,
            SportType = message.SportType,
            VoidingHistoryId = message.VoidingHistoryId
        };

        return await sendEmailService.SendEmail(emailModel);
    }
}