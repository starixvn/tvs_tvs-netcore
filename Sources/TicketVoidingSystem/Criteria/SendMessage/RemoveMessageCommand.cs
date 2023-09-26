using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.SendMessage;

public class RemoveMessageCommand : NonQueryCommand
{
    public string TransIds { get; set; }

    public int UserId { get; set; }

    public override string GetSettingKey() => "NAP_RecoverBet_MessageDel";

    public override bool IsValid() => UserId > 0 && !string.IsNullOrWhiteSpace(TransIds);
}