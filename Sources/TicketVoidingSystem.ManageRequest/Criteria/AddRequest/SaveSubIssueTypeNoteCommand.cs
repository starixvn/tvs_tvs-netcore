using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class SaveSubIssueTypeNoteCommand : NonQueryCommand
{
    public int IssueTypeId { get; set; }

    public int UserId { get; set; }

    public int GroupId { get; set; }

    public string Note { get; set; }

    public override string GetSettingKey() => "TicketVoiding_SubIssueTypeNote_Update";

    public override bool IsValid() => true;
}