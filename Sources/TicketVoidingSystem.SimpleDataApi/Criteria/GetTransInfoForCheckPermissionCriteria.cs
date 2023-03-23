using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SimpleDataApi.Criteria
{
    public class GetTransInfoForCheckPermissionCriteria : CriteriaBase
    {
        public string TransIds { get; set; }

        [SpParam(Ignored = true)]
        public int SiteDbGroupId { get; set; }

        public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_CheckVoidBetPermission_TransInfo");

        public override bool IsValid() => true;
    }
}