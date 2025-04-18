using System;

namespace TicketVoidingSystem.Services.Notification;

public static class MessageHelper
{
    public static string CreateAddRequestSuccessfully(int requestId, int markedCount)
    {
        return $"<strong>Request {requestId}</strong> is added successfully"
            + $"{Environment.NewLine}Marked ticket: {markedCount}/@@";
    }

    public static string CreateAddRequestFailed(int markedCount)
    {
        return $"Add request has error"
               + $"{Environment.NewLine}Marked ticket: {markedCount}/@@";
    }

    public static string CreateEditRequestSuccessfully(int requestId, string editedBy, int markedCount)
    {
        return $"<strong>Request {requestId}</strong> is edited by {editedBy} successfully"
               + $"{Environment.NewLine}Marked ticket: {markedCount}/@@";
    }

    public static string CreateEditRequestFailed(int requestId, int markedCount)
    {
        return $"Edit request {requestId} has error"
               + $"{Environment.NewLine}Marked ticket: {markedCount}/@@";
    }
}