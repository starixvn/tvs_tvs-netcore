using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models.SendMessage;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class RequestDetailViewModel
{
    public RequestDetailModel Request { get; set; }
    public IEnumerable<Message> Messages { get; set; }
    public RequestEventModel Event { get; set; }
    public IEnumerable<WrongScoreInfoViewModel> WrongScoreModels { get; set; }
    public IEnumerable<DangerAcceptedViewModel> DangerAcceptedModels { get; set; }
    public IEnumerable<DangerAcceptedViewModel> RedCardModels { get; set; }
    public IEnumerable<WrongHdpViewModel> WrongHdpModels { get; set; }
    public IEnumerable<WrongOuViewModel> WrongOuModels { get; set; }
    public IEnumerable<WrongOddsViewModel> WrongOddsModels { get; set; }
    public IEnumerable<ReducedOverViewModel> ReducedOverModels { get; set; }
    public IEnumerable<NotParticipateViewModel> NotParticipateModels { get; set; }
    public IEnumerable<EarlyKickOffViewModel> EarlyKickOffModels { get; set; }
    public DuplicateTicketsViewModel DuplicateTicketsModel { get; set; }
    public AbnormalAccountViewModel AbnormalAccountModel { get; set; }
}