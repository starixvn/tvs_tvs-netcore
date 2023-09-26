using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.SendMessage;

public class DeleteVoidedTransactionCommand : NonQueryCommand
{
    public string TicketsXml { get; set; }

    public override string GetSettingKey() => "TicketVoiding_VoidedTransaction_Delete";

    public override bool IsValid() => true;
}