using Fanex.Data.Repository;

namespace TicketVoidingSystem.ABExceptionList.Criteria
{
    public class GetUsersCriteria : CriteriaBase
    {
        public string UserName { get; set; }
        public string Level { get; set; }
        public string Sites { get; set; }
        public string SubTypes { get; set; }
        public string VoidVIP { get; set; }
        public string InvalidUsername { get; set; }

        public override string GetSettingKey() => "TicketVoiding_ABWhiteList_Select";

        public override bool IsValid() => true;
    }
}