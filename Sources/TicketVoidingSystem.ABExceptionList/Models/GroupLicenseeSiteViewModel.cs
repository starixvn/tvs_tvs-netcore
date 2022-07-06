using System.Collections.Generic;

namespace TicketVoidingSystem.ABExceptionList.Models
{
    public class GroupLicenseeSiteViewModel
    {
        public string GroupName { get; set; }
        public IEnumerable<LicenseeSite> Sites { get; set; }
    }
}