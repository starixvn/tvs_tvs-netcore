using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models;

public class GroupTicketsMappingParameters
{
    public Group<GetTicketModel> Group { get; set; }
    public Match Match { get; set; }
    public int StartIndex { get; set; }
    public int IssueTypeId { get; set; }
    public VoidPermission VoidPermission { get; set; }
}