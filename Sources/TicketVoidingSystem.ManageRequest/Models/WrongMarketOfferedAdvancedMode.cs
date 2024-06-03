namespace TicketVoidingSystem.ManageRequest.Models;

public class WrongMarketOfferedAdvancedMode
{
    public List<BetTeamAddRequest> BetTeams { get; set; }
}

public class Item
{
    public string Name { get; set; }
    public string Value { get; set; }
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

    public string Wicket { get; set; }

    public string Over { get; set; }

    public string Player { get; set; }

    public string Quarter { get; set; }

    public string Set { get; set; }

    public string Game { get; set; }

    public string Map { get; set; }

    public string Round { get; set; }

    public string Point { get; set; }

    public string Kill { get; set; }

    public string Tower { get; set; }

    public string Turret { get; set; }

    public string Ball { get; set; }

    public string Delivery { get; set; }

    public string PlayerAndOdds { get; set; }
}