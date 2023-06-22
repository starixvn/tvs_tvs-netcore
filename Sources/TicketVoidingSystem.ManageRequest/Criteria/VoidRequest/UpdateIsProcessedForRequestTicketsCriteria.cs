using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class UpdateIsProcessedForRequestTicketsCriteria : NonQueryCommand
{
    public string SingleTicketsJson { get; set; }
    public string ParlayTicketsJson { get; set; }
    public string CancelCashOutTicketsJson { get; set; }
    public string CricketTicketsJson { get; set; }

    public override string GetSettingKey() => "TicketVoiding_TicketProcess_Update";

    public override bool IsValid() => true;
}