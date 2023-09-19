using Fanex.Data.Repository;

namespace SpecialDelete.UploadBatchMessage.Criteria;

public class GetReceivedUsersCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public string ProductIds { get; set; }

    public string GroupName { get; set; }

    public override string GetSettingKey() => "Acc_BettransSelBet_BatchMsg";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(TransIds);
}