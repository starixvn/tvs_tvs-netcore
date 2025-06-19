namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class CheckValidTransIdsViewModel
{
    public ValidationAbnormalBet Validation { get; set; }
    public IEnumerable<MatchInfoAddRequest> Matches { get; set; }
    public TransInfoAddRequestModel TransInfoAddRequestModel { get; set; }
    public IEnumerable<AbnormalBetTicketViewModel> AbnormalBetTicketRequests { get; set; }
    public IEnumerable<SendLetstalkModel> SendLetstalkModels { get; set; }
}

public class ValidationAbnormalBet
{
    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }

    public string DifferentMatchTransIds { get; set; }

    public string SettledTransIds { get; set; }

    public string UnsupportedTransIds { get; set; }

    public string ExistingReqTransIds { get; set; }

    public string TransIdsOfVIPCustomer { get; set; }

    public string TransIdsOfCustomerClass201 { get; set; }

    public string TransIdsOfCustomerClass4K { get; set; }

    public string TransIdsCreditCashService { get; set; }

    public string NonLiveTransIds { get; set; }

    public string DifferentLiveScoreTransIds { get; set; }

    public string ABWhiteListTransIds { get; set; }

    public bool IsHasWarningRemovedTickets { get; set; }
}

public class SendLetstalkModel
{
    public int MatchId { get; set; }

    public bool IsHasUusTickets { get; set; }

    public string ListBetType { get; set; }

    public string ListBetTeam { get; set; }
}