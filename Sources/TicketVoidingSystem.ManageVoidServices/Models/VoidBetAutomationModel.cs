namespace TicketVoidingSystem.ManageVoidServices.Models;

public class VoidBetAutomationModel
{
    public int VoidingHistoryId { get; set; }

    public int RequestId { get; set; }

    public byte? StatusId { get; set; }

    public int? MatchId { get; set; }

    public bool? IsAutoVoid { get; set; }

    public bool? IsRunExternalService { get; set; }

    public int? MessageId { get; set; }

    public int? MessageIdSpecial { get; set; }

    public int? ReasonId { get; set; }

    public bool? IsSentBatchMessage { get; set; }

    public bool? IsSentMessageToAdminSite { get; set; }

    public bool? IsInsertedVoidedTransaction { get; set; }

    public bool? IsUpdatedVoidingHistory { get; set; }

    public bool? IsSentEmail { get; set; }

    public bool? IsDeletedZzzBetTrans { get; set; }

    public bool? IsDeletedMessage { get; set; }

    public bool? IsDeletedVoidedTransaction { get; set; }
}