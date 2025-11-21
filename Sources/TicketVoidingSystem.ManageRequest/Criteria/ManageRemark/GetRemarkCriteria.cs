using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;

public class GetRemarkCriteria : CriteriaBase
{
    public int RemarkId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Remark_Select";

    public override bool IsValid() => true;
}

