using System.Collections.Generic;
using TicketVoidingSystem.SharedApi.Models.MessageTemplate;

namespace TicketVoidingSystem.SharedApi.ViewModels.MessageTemplate;

public class MessageTemplateViewModel : TemplateContent
{
    public int TemplateId { get; set; }
    public IEnumerable<InputText> InputTexts { get; set; }
}