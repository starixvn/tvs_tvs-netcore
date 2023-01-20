using System;

namespace TicketVoidingSystem.Utilities
{
    public static class FanexCommonConverter
    {
        public static decimal ToDecimal(object item, decimal defaultValue = 0M)
        {
            var result = defaultValue;
            var flag = false;
            if (item != null && item != DBNull.Value)
            {
                flag = decimal.TryParse(item.ToString(), out result);
            }

            return !flag ? defaultValue : result;
        }
    }
}