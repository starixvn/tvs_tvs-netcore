using TicketVoidingSystem.Models.SendMessage;

namespace SpecialDelete.UploadBatchMessage.Models;

using System.Collections.Generic;

public class UpdateMessageQueryModel
{
    public List<ReceivedUser> CreditTrans { get; set; }

    public int MessageContentType { get; set; }

    public Message Message { get; set; }
}