using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;

public class DeleteRemarkCommand : NonQueryCommand
{
    public int RemarkId { get; set; }
    public int UserId { get; set; }
    public string IP { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Remark_Delete";

    public override bool IsValid() => RemarkId > 0;
}

