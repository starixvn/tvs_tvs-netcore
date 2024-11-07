using System.Collections.Generic;

namespace TicketVoidingSystem.SharedApi.Models;

public class GroupLicensee
{
    public string GroupName { get; set; }

    public IEnumerable<Licensee> Licensees { get; set; }
}

public class Licensee
{
    public string Id { get; set; }

    public string Name { get; set; }

    public string GroupName { get; set; }
}