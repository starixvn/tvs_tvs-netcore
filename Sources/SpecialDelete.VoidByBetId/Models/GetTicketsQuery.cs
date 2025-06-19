namespace SpecialDelete.VoidByBetId.Models;

public class GetTicketsQuery
{
    public string? TransIds { get; set; }

    public byte? AbnormalBetType { get; set; }

    public bool IncludeMainParlay { get; set; }
}