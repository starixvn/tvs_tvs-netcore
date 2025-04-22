using System;

namespace TicketVoidingSystem.Services.Notification;

public static class MessageHelper
{
    public static string CreateAddRequestSuccessfully(int requestId)
    {
        return $"<strong>Request {requestId}</strong> is added successfully"
            + $"{Environment.NewLine}Marked ticket: @marked/@total";
    }

    public static string CreateAddRequestFailed()
    {
        return $"Add request has error"
               + $"{Environment.NewLine}Marked ticket: @marked/@total";
    }

    public static string CreateEditRequestSuccessfully(int requestId, string editedBy)
    {
        return $"<strong>Request {requestId}</strong> is edited by <strong>{editedBy}</strong> successfully"
               + $"{Environment.NewLine}Marked ticket: @marked/@total";
    }

    public static string CreateEditRequestFailed(int requestId)
    {
        return $"Edit request {requestId} has error"
               + $"{Environment.NewLine}Marked ticket: @marked/@total";
    }
}