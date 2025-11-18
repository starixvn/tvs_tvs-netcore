using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;

public class UpdateRemarkCommand : NonQueryCommand
{
    public int RemarkId { get; set; }
    public int UserId { get; set; }
    public string IP { get; set; }
    public bool IsTest { get; set; }
    public bool IsCheckedVar { get; set; }
    public string MistakenBy { get; set; }
    public string DecidedBy { get; set; }
    public string PerformedBy { get; set; }
    public string Iptv { get; set; }
    public string Operators { get; set; }
    public string Provider { get; set; }
    public string Source { get; set; }
    public string Remark { get; set; }
    public string Message { get; set; }
    public string Description { get; set; }
    public string Action { get; set; }
    public override string GetSettingKey() => "TicketVoiding_Remark_Update";
    public override bool IsValid() => true;
}

