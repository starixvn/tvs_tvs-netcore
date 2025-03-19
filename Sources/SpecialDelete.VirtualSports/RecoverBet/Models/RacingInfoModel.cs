using Settlement.Business.Core.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Models;

public class RacingInfoModel
{
    public RaceInfo RaceInfo { get; set; }
    public List<Outright> Outright { get; set; }
    public List<Resources> Resources { get; set; }
}