namespace SpecialDelete.VoidByBetId.Models;

using System;

public class GetTicketsQuery
{
    public string? CustId { get; set; }

    public string? TransIds { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool IncludeMainParlay { get; set; }

    public string? Products { get; set; }

    public string? StatusIds { get; set; }

    public string? InvalidTransIds { get; set; }

    public string? MovedTransIds { get; set; }

    public bool IsAbnormalBet { get; set; }
}