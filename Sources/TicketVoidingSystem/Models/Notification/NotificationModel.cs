using System;
using System.Text.Json.Serialization;
using TicketVoidingSystem.Web.JsonConverter;

namespace TicketVoidingSystem.Models.Notification;

public class NotificationModel
{
    public int Id { get; set; }

    public string Username { get; set; }

    public string Content { get; set; }

    [JsonConverter(typeof(GMT8DateTimeJsonConverter))]
    public DateTime? CreatedDate { get; set; }

    public bool IsRead { get; set; }

    public string Type { get; set; }
}