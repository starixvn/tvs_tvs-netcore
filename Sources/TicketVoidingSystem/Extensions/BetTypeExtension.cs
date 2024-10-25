using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Extensions;

public static class BetTypeExtension
{
    public static bool IsParlay(this int id)
    {
        List<int> betTypesParlay = new() { BetTypeConstant.SystemParlay, BetTypeConstant.VirtualSportParlay, BetTypeConstant.VirtualSport4MixParlay, BetTypeConstant.VirtualSport5MixParlay };
        return betTypesParlay.Contains(id);
    }

    public static bool IsParlayAndBetBuilder(this int id)
    {
        return id.IsParlay() || id.IsSingleMatchParlay();
    }

    private static bool IsNumberGame(this int id)
    {
        return id is >= BetTypeConstant.FirstNumberGame and <= BetTypeConstant.SecondNumberGame;
    }

    private static bool IsLucky3(this int id)
    {
        return id is >= BetTypeConstant.FirstLucky3 and <= BetTypeConstant.SecondLucky3;
    }

    public static bool IsSingleMatchParlay(this int id)
    {
        const int betTypeSingleMatchParlay = 38;
        return id == betTypeSingleMatchParlay;
    }

    public static bool IsBitCoin(this int id)
    {
        return id == BetTypeConstant.BitCoinOverUnder;
    }

    public static bool IsSabaPromotion(this int id)
    {
        int[] SportTypeSabaPromotions = { 17000, 17001, 17002, 17003, 17004, 17006, 17007, 17008, 17009, 17010 };
        return SportTypeSabaPromotions.Contains(id);
    }

    public static bool IsOutright(this int id)
    {
        return id == BetTypeConstant.Outright;
    }

    public static bool IsPenaltyShootoutCombo(this int id)
    {
        return id == BetTypeConstant.PenaltyShootoutCombo;
    }

    public static bool IsVirtualSportBetType(this int id)
    {
        return id is >= BetTypeConstant.FirstVirtualSport and <= BetTypeConstant.SecondVirtualSport
                   or >= BetTypeConstant.MinVirtualSportBetType and <= BetTypeConstant.MaxVirtualSportBetType
               || id.IsVirtualSport4BetType() || IsVirtualSport5BetType(id) || IsVirtualSport6BetType(id);
    }

    private static bool IsVirtualSport4BetType(this int id)
    {
        return id is BetTypeConstant.VirtualSport4MixParlay or BetTypeConstant.VirtualSport4MatchWinner;
    }

    private static bool IsVirtualSport5BetType(this int id)
    {
        List<int> betTypesVirtualSport5 = new() { 11050, 11051, 11052, 11053, 11054, 11055, 11099 };
        return betTypesVirtualSport5.Contains(id);
    }

    public static bool IsVirtualSport6BetType(this int id)
    {
        List<int> betTypesVirtualSport6 = new() { 13000, 13001, 13002, 13003, 13004, 13005, 13006, 13007, 13008, 13009, 13010, 13011 };
        return betTypesVirtualSport6.Contains(id);
    }

    public static bool IsVirtualSport2(this int sportTypeId)    // Sport Type of VirtualSport2 except 177, 198
    {
        List<int> VirtualSportsSportTypeIds = new() { 190, 191, 192, 193, 194, 195, 196, 197 };
        return VirtualSportsSportTypeIds.Contains(sportTypeId);
    }

    public static bool IsVirtualSports2Betradar(this int sportTypeId)
    {
        return sportTypeId is SportTypeConstant.VirtualHorseRacing or SportTypeConstant.VirtualDogRacing;
    }

    public static bool IsVirtualSport345(this int sportTypeId) // Sport Type of VS3-VS4-VS5
    {
        List<int> VirtualSportsSportTypeIds = new() { 178, 179, 188, 9908, 147 };
        return VirtualSportsSportTypeIds.Contains(sportTypeId);
    }

    public static bool IsSabaTimeMachine(this int betTypeId)
    {
        return betTypeId is BetTypeConstant.SabaOUTimeMachine or BetTypeConstant.SabaHdpTimeMachine;
    }

    public static bool IsHideHandicap(this int id)
    {
        return id.IsParlayAndBetBuilder() || id.IsNumberGame() || id.IsLucky3();
    }

    public static bool HideScore(this int id)
    {
        return id.IsParlayAndBetBuilder() || id.IsNumberGame() || id.IsVirtualSportBetType() || id.IsLucky3();
    }

    public static string TranslateChineseSimplified(this string name)
    {
        return name.Replace("Next", "下一个");
    }

    public static string ToXml(this IEnumerable<BetTypeXml> betTypes)
    {
        if (betTypes == null)
        {
            return null;
        }

        var temp = new StringBuilder();
        foreach (var item in betTypes)
        {
            var betType = Environment.NewLine + string.Format(StringResource.BetTypeXml,
                item.Id, item.BetTeam, item.Set, item.Game, item.Value, item.ValueHdp1, item.ValueHdp2, item.Goal, item.BetOption, item.OddsSpread, item.OddsId, item.Transdesc, item.VirtualHead);
            temp.Append(betType.Replace("=\"\"", "=\"All\""));
        }

        return $"<BetTypes>{temp}{Environment.NewLine}</BetTypes>";
    }
}