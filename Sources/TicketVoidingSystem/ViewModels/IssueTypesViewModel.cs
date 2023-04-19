using System.Collections.Generic;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ViewModels;

public class IssueTypesViewModel
{
    public IEnumerable<IssueType> IssueTypes { get; set; }
    public IEnumerable<SubIssueType> SubIssueTypes { get; set; }
}