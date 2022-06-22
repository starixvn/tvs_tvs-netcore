using System;

namespace TicketVoidingSystem.Core.Extensions
{
    public static class SystemTimeExtension
    {
        private const sbyte OffsetHour = 12;

        public static DateTime? ZoneManila(this DateTime? dateTime)
        {
            return dateTime.HasValue ? Convert.ToDateTime(dateTime).AddHours(OffsetHour) : dateTime;
        }

        public static DateTime ZoneManila(this DateTime dateTime)
        {
            return Convert.ToDateTime(dateTime).AddHours(OffsetHour);
        }
    }
}