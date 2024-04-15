using System.Collections.Generic;

namespace TicketVoidingSystem.SharedApi.Models.BetTypes;

public class Item
{
    public string Name { get; set; }
    public string Value { get; set; }
    public bool Flag { get; set; }
    public string XmlAttribute { get; set; }
}

public class Selection
{
    public List<Selection> Items { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public bool IsMultiple { get; set; }
    public bool IsCanSelectMapFromOutside { get; set; }
    public bool IsCanSelectRoundFromOutside { get; set; }
    public string XmlAttribute { get; set; }
}

public class BetTeam
{
    public List<Selection> Selections { get; set; }
    public List<Item> Items { get; set; }
    public List<Item> Inputs { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public byte Type { get; set; }
    public string EnableBetTypes { get; set; }
    public string BetTypes { get; set; }
}

public class AdvancedMode
{
    public List<BetTeam> BetTeams { get; set; }
}