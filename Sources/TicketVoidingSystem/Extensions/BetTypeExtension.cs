using System;
using System.Collections.Generic;
using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Extensions;

public static class BetTypeExtension
{
    public static bool IsParlay(this int id)
    {
        return id is BetTypeConstant.SystemParlay or BetTypeConstant.VirtualSportParlay;
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
        const int betType17000 = 17000;
        const int betType17003 = 17003;
        return id is betType17000 or betType17003;
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
               || id is >= BetTypeConstant.MinVirtualSportBetType and <= BetTypeConstant.MaxVirtualSportBetType;
    }

    private static readonly List<int> VirtualSports = new() { 190, 191, 192, 193, 194, 195, 196, 197, 178, 179 };

    public static bool IsVirtualSport(this int sportTypeId)
    {
        return VirtualSports.Contains(sportTypeId);
    }

    public static bool IsVirtualSportParlay(this int id)
    {
        return id is BetTypeConstant.VirtualSportParlay;
    }

    public static bool IsHideHandicap(this int id)
    {
        return id.IsParlayAndBetBuilder() || id.IsNumberGame() || id.IsLucky3() || id.IsVirtualSportParlay();
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
                item.Id, item.BetTeam, item.Set, item.Game, item.Value, item.ValueHdp1, item.ValueHdp2, item.Goal, item.BetOption, item.OddsSpread, item.OddsId, item.Transdesc);
            temp.Append(betType.Replace("=\"\"", "=\"All\""));
        }

        return $"<BetTypes>{temp}{Environment.NewLine}</BetTypes>";
    }
}