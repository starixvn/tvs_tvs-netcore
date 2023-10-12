using SpecialDelete.VoidByCurrency.Models;

namespace SpecialDelete.VoidByCurrency.ViewModels;

public class FilterViewModel
{
    public string Remark { get; set; }

    public List<GroupLicensee> GroupLicensees { get; set; }

    public List<Currency> Currencies { get; set; }
}