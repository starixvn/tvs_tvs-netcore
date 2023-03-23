using System;

namespace TicketVoidingSystem.Extensions
{
    public static class SystemTimeExtension
    {
        private const sbyte OffsetHour = 12;

        public static DateTime? ZoneCanada(this DateTime? dateTime)
        {
            return dateTime.HasValue ? Convert.ToDateTime(dateTime).AddHours(-OffsetHour) : dateTime;
        }

        public static DateTime ZoneCanada(this DateTime dateTime)
        {
            return Convert.ToDateTime(dateTime).AddHours(-OffsetHour);
        }

        public static DateTime? ZoneManila(this DateTime? dateTime)
        {
            return dateTime.HasValue ? Convert.ToDateTime(dateTime).AddHours(OffsetHour) : dateTime;
        }

        public static DateTime ZoneManila(this DateTime dateTime)
        {
            return Convert.ToDateTime(dateTime).AddHours(OffsetHour);
        }

        public static DateTime? AddDays(this DateTime? dateTime, int number)
        {
            return dateTime.HasValue ? Convert.ToDateTime(dateTime).AddDays(number) : dateTime;
        }
    }
}