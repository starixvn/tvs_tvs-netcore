namespace SpecialDelete.VoidByCurrency.Models;

public class GroupLicensee
{
    public string GroupName { get; set; }

    public List<Licensee> Licensees { get; set; }
}