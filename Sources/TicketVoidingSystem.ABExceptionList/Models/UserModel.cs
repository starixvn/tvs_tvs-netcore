using System;

namespace TicketVoidingSystem.ABExceptionList.Models
{
    public class UserModel
    {
        public string Username { get; set; }
        public int CustId { get; set; }
        public string Level { get; set; }
        public string Site { get; set; }
        public DateTime AddedDate { get; set; }
        public string AddedBy { get; set; }
        public string SubTypeName { get; set; }
        public string IsAllowVoidVIP { get; set; }
    }
}