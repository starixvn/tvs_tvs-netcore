using System.Collections.Generic;
using Fanex.NAP.Client.Models;

namespace TicketVoidingSystem.Utility.Models
{
    internal class NapUserViewModel
    {
        public IList<MenuItem> MenuItem { get; set; }
        public string UserName { get; set; }
        public int UserId { get; set; }
    }
}