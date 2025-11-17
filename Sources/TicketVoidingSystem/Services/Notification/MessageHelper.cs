using System;

namespace TicketVoidingSystem.Services.Notification;

public static class MessageHelper
{
    public static string CreateAddRequestSuccessfully(int requestId)
    {
        return $"<strong>Request {requestId}</strong> is added successfully"
            + $"{Environment.NewLine}Marked ticket: @marked/@total";
    }

    public static string CreateAddRequestFailed(int markedTotal)
    {
        return $"Add request has error"
               + $"{Environment.NewLine}Marked ticket: {markedTotal}";
    }

    public static string CreateEditRequestSuccessfully(int requestId, string editedBy)
    {
        return $"<strong>Request {requestId}</strong> is edited by <strong>{editedBy}</strong> successfully"
               + $"{Environment.NewLine}Marked ticket: @marked/@total";
    }

    public static string CreateEditRequestFailed(int requestId, int markedTotal)
    {
        return $"Edit request {requestId} has error"
               + $"{Environment.NewLine}Marked ticket: {markedTotal}/@total";
    }

    public static string CreateStoredRequestSuccessfully(int requestId, bool isStore, string username)
    {
        var action = isStore ? "stored" : "un-stored";
        return $"<strong>Request {requestId}</strong> is {action} by <strong>{username}</strong> successfully";
    }

    public static string CreateStoredRequestFailed(int requestId, bool isStore)
    {
        var action = isStore ? "store" : "un-store";
        return $"<strong>Request {requestId}</strong> has failed to {action}";
    }

    public static string CreateAddRemarkSuccessfully(int remarkId)
    {
        return $"<strong>Remark {remarkId}</strong> is added successfully";
    }

    public static string CreateAddRemarkFailed()
    {
        return $"Add remark has error";
    }
}