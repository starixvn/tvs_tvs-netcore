using Fanex.Data.Repository;

namespace TicketVoidingSystem.SimpleDataApi
{
    public abstract class TransInfoCriteriaBase : CriteriaBase
    {
        public byte[] TransInfoJson0 { get; set; }

        public byte[] TransInfoJson1 { get; set; }

        public byte[] TransInfoJson2 { get; set; }
    }

    public abstract class TransInfoNonQueryCommand : NonQueryCommand
    {
        public byte[] TransInfoJson0 { get; set; }

        public byte[] TransInfoJson1 { get; set; }

        public byte[] TransInfoJson2 { get; set; }
    }
}