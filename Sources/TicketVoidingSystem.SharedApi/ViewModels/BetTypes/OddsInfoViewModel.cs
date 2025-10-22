namespace TicketVoidingSystem.SharedApi.ViewModels.BetTypes;

public class OddsInfoViewModel
{
    public string OddsId { get; set; }

    public int PlayerId { get; set; }

    public string PlayerName { get; set; }

    public int BetTypeId { get; set; }

    public string BetChoice { get; set; }

    public string PlayNamesChineseTraditional { get; set; }

    public string PlayNamesChineseSimplified { get; set; }

    public string OddsInfo { get; set; }

    public string Performance { get; set; }
}