using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class ValidateRequestCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public string MarkTransIds { get; set; }

    public string UnMarkTransIds { get; set; }

    public int UserId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Request_Validate";

    public override bool IsValid() => true;
}