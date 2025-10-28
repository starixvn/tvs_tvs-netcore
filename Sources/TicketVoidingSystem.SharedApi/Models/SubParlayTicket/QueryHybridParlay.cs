namespace TicketVoidingSystem.SharedApi.Models.SubParlayTicket;

public class QueryHybridParlay : QueryNormalParlay
{
    public string Transdesc { get; set; }
    public string SubTransId { get; set; }
}