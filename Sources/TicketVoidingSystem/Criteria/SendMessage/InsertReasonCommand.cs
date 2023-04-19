using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.SendMessage;

public class InsertReasonCommand : NonQueryCommand
{
    public string ReasonEnglish { get; set; }
    public string ReasonChineseSimplified { get; set; }
    public int ReasonId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Reason_Insert";

    public override bool IsValid() => true;
}