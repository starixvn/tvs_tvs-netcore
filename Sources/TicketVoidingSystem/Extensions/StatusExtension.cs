using System;
using System.Collections.Generic;
using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.Extensions;

public static class StatusExtension
{
    private static readonly List<string> SettledStatus = [TicketStatus.Draw, TicketStatus.Won, TicketStatus.Lose];
    private static readonly List<string> RunningOrWaiting = [TicketStatus.Running, TicketStatus.Waiting];

    public static bool IsRunningOrWaiting(this string status)
    {
        return !string.IsNullOrEmpty(status) && RunningOrWaiting.Contains(status.ToLowerInvariant());
    }

    public static bool IsVoided(this string status)
    {
        return status.Equals(TicketStatus.Void, StringComparison.OrdinalIgnoreCase);
    }

    public static bool IsSettled(this string status)
    {
        return SettledStatus.Contains(status.ToLowerInvariant());
    }

    public static bool IsRefund(this string status)
    {
        return status.Equals(TicketStatus.Refund, StringComparison.OrdinalIgnoreCase);
    }

    public static bool IsRunning(this string status)
    {
        return status.Equals(TicketStatus.Running, StringComparison.OrdinalIgnoreCase);
    }

    public static bool IsRunningOrEmpty(this string status)
    {
        return string.IsNullOrEmpty(status) || RunningOrWaiting.Contains(status.ToLowerInvariant());
    }

    public static bool IsWon(this string status)
    {
        return status.Equals(TicketStatus.Won, StringComparison.OrdinalIgnoreCase);
    }
}