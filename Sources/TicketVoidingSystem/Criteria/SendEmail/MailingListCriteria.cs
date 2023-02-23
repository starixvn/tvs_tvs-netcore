using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.SendEmail;

public class MailingListCriteria : CriteriaBase
{
    public int? CategoryId { get; set; }

    public override string GetSettingKey() => "SpecialDelete_MailingList_Select";

    public override bool IsValid() => true;
}