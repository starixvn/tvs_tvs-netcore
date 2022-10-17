using Fanex.Data;
using Fanex.Data.Repository;
using SpecialDelete.Core.Utils;

namespace TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark
{
    public class GetTransInfoForAutoUnmarkCriteria : CriteriaBase
    {
        public string MatchId { get; set; }

        public string SportType { get; set; }

        public int MarkedBy { get; set; }

        public bool IsExcludeTest { get; set; }

        [SpParam(Ignored = true)]
        public int SiteDbGroupId { get; set; }

        public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_AutoUnmark_TransInfo_Select");

        public override bool IsValid() => true;
    }
}