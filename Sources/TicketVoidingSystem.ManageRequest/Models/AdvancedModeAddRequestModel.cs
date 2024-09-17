namespace TicketVoidingSystem.ManageRequest.Models;

public class AdvancedModeAddRequestModel
{
    public List<BetTeamAddRequest> BetTeams { get; set; }
}

public class Item
{
    public string Name { get; set; }
    public string Value { get; set; }
    public bool IsRowSpan { get; set; }
    public bool IsDisable { get; set; }
    public bool IsMultiple { get; set; }
    public string XmlAttribute { get; set; }
}

public class Selection
{
    public List<Selection> Items { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public bool IsMultiple { get; set; }
    public string XmlAttribute { get; set; }
}

public class BetTeamAddRequest
{
    public List<Selection> Selections { get; set; }
    public List<Item> Inputs { get; set; }
    public List<Item> Items { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public byte Type { get; set; }
    public string BetTypes { get; set; }
}

public class BetTeamAddRequestResult
{
    public string Id { get; set; }

    public string Team { get; set; }

    public string Hdp { get; set; }

    public string Hdp1 { get; set; }

    public string Player { get; set; }

    public string PlayerAndOdds { get; set; }

    public string BetIdX { get; set; }

    public string BetIdY { get; set; }

    public string FilterBetIdX { get; set; }

    public string FilterBetIdY { get; set; }
}