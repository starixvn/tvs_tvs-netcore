using System.Collections.Generic;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.SharedApi.Handlers.SendEmail;

public class SendEmailRecoverApiRequest : IRequest<IEnumerable<Result>>
{
    public string NegativeBalanceUsers { get; set; }
    public IEnumerable<TicketEmailModel> EmailRecoverTickets { get; set; }
}

//public class SendEmailRecoverApiHandler : IRequestHandler<SendEmailRecoverApiRequest, IEnumerable<Result>>
//{
//    private readonly SendEmailService sendEmailService;

//    public SendEmailRecoverApiHandler(SendEmailService sendEmailService)
//    {
//        this.sendEmailService = sendEmailService;
//    }

//    public async Task<IEnumerable<Result>> Handle(SendEmailRecoverApiRequest message, CancellationToken cancellationToken)
//    {
//        var emailModel = new EmailRecoverModel
//        {
//            Match = message.Match,
//            Message = message.Message,
//            IssueTypeId = message.IssueTypeId,
//            NegativeBalanceUsers = message.NegativeBalanceUsers,
//            Reason = message.VoidedReason.ReasonEnglish,
//            ReasonSC = message.VoidedReason.ReasonChineseSimplified
//        };

//        return await sendEmailService.SendEmail(emailModel, message.EmailTickets.ToList(), true);
//    }
//}