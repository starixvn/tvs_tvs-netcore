using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class CheckValidTransIdsViewModel
{
    public ValidationAbnormalBet Validation { get; set; }
    public MatchInfoAddRequest Match { get; set; }
    public TransInfoAddRequestModel TransInfoAddRequestModel { get; set; }
    public IEnumerable<AbnormalBetTicketViewModel> AbnormalBetTicketRequests { get; set; }
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

    public string NonLiveTransIds { get; set; }

    public string DifferentLiveScoreTransIds { get; set; }

    public string ABWhiteListTransIds { get; set; }

    public bool IsHasWarningRemovedTickets { get; set; }

    public bool IsHasUusTickets { get; set; }
    public string ListBettype { get; set; }
    public string ListBetteam { get; set; }
}