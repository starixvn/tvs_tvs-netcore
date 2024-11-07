using TicketVoidingSystem.SharedApi.Models;

namespace SpecialDelete.VoidByCurrency.ViewModels;

public class FilterViewModel
{
    public string Remark { get; set; }

    public IEnumerable<GroupLicensee> GroupLicensees { get; set; }

    public IEnumerable<Currency> Currencies { get; set; }
}