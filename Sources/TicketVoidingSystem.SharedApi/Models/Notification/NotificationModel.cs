using System;

namespace TicketVoidingSystem.SharedApi.Models.Notification;

public class NotificationModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Message { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; }
    public string Type { get; set; }
}