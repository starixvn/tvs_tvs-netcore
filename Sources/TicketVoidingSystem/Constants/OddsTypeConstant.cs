using System.Collections.Generic;

namespace TicketVoidingSystem.Constants
{
    public static class OddsTypeConstant
    {
        public const int Decimal = 1;

        public const int HongKong = 2;

        public const int Indo = 3;

        public const int Myanmar = 6;

        public const int Us = 5;

        public static IList<int> BetTypeOfDecimalOdds
        {
            get
            {
                var betTypeOfDecimalOdds = new List<int> { 1, 2, 3, 7, 12, 8, 20, 124, 125, 801, 802, 803, 804, 805, 806 };

                for (var i = 81; i <= 88; i++)
                {
                    betTypeOfDecimalOdds.Add(i);
                }

                for (var i = 91; i <= 120; i++)
                {
                    betTypeOfDecimalOdds.Add(i);
                }

                return betTypeOfDecimalOdds;
            }
        }
    }
}