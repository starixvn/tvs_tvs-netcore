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

    public Message SpecialMessage { get; set; }

    public int IssueTypeId { get; set; }

    public int RequestId { get; set; }

    public int? FilterBy { get; set; }

    public int SportType { get; set; }

    public int VoidingHistoryId { get; set; }
}

public class SendEmailApiDuplicateTicketsHandler(SendEmailDuplicateTicketsService sendEmailService)
    : IRequestHandler<SendEmailApiDuplicateTicketsRequest, IEnumerable<Result>>
{
    public async Task<IEnumerable<Result>> Handle(SendEmailApiDuplicateTicketsRequest message, CancellationToken cancellationToken)
    {
        var emailModel = new EmailVoidModel
        {
            Message = message.Message,
            SpecialMessageAfterVoidService = message.SpecialMessage,
            IssueTypeId = message.IssueTypeId,
            RequestId = message.RequestId,
            FilterBy = message.FilterBy,
            SportType = message.SportType,
            VoidingHistoryId = message.VoidingHistoryId
        };

        return await sendEmailService.SendEmail(emailModel);
    }
}