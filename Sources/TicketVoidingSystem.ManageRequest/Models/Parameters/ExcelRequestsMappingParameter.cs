using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models.Parameters;

public class ExcelRequestsMappingParameter
{
    public RequestViewModel CurrentViewModel { get; init; }
    public int? NumberOfRequestDetail { get; init; }
    public int? CurrentIndex { get; init; }
    public IEnumerable<IssueType> IssueTypes { get; init; }
    public IEnumerable<SubIssueType> SubIssueTypes { get; init; }
    public IEnumerable<VoidAction> VoidActions { get; init; }
}