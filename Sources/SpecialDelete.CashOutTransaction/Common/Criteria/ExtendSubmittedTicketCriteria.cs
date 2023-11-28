namespace SpecialDelete.CashOutTransaction.Common.Criteria;

public interface ExtendSubmittedTicketCriteria
{
    int SiteDbGroupId { get; set; }

    string TransIds { get; set; }
}