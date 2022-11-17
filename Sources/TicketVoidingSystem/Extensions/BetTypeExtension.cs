using System;
using System.Collections.Generic;
using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Extensions
{
    public static class BetTypeExtension
    {
        public static bool IsParlay(this int id)
        {
            return id == 29 || id == 2799;
        }

        public static bool IsParlayAndBetBuilder(this int id)
        {
            return id.IsParlay() || id.IsSingleMatchParlay();
        }

        public static bool IsNumberGame(this int id)
        {
            return BetTypeConstant.FirstNumberGame <= id && id <= BetTypeConstant.SecondNumberGame;
        }

        public static bool IsLucky3(this int id)
        {
            return BetTypeConstant.FirstLucky3 <= id && id <= BetTypeConstant.SecondLucky3;
        }

        public static bool IsSingleMatchParlay(this int id)
        {
            return id == 38;
        }

        public static bool IsBitCoin(this int id)
        {
            return id == BetTypeConstant.BitCoinOverUnder;
        }

        public static bool IsSabaPromotion(this int id)
        {
            return id == 17000 || id == 17003;
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
            return BetTypeConstant.FirstVirtualSport <= id && id <= BetTypeConstant.SecondVirtualSport || BetTypeConstant.MinVirtualSportBetType <= id && id <= BetTypeConstant.MaxVirtualSportBetType;
        }

        public static bool IsHideHandicap(this int id)
        {
            return id.IsParlayAndBetBuilder() || id.IsNumberGame() || id.IsLucky3();
        }

        public static bool HideScore(this int id)
        {
            return id.IsParlayAndBetBuilder() || id.IsNumberGame() || id.IsVirtualSportBetType() || id.IsLucky3();
        }

        public static string ToXml(this List<BetTypeXml> betTypes)
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

        public static string TranslateChineseSimplified(this string name)
        {
            return name.Replace("Next", "下一个");
        }
    }
}