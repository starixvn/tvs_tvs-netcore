using System.Collections.Generic;
using Fanex.NAP.Client.Models;

namespace TicketVoidingSystem.Utility.Models
{
    internal class UserViewModel
    {
        public IList<MenuItem> MenuItem { get; set; }
        public string UserName { get; set; }
        public int UserId { get; set; }
    }
}