using System.Collections.Generic;

namespace TicketVoidingSystem.ABExceptionList.Models
{
    public class UserViewModel
    {
        public IEnumerable<UserModel> Users { get; set; }
        public string InvalidUsername { get; set; }
    }
}