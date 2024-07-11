using System.Collections.Generic;
using TicketVoidingSystem.SharedApi.Models.MessageTemplate;

namespace TicketVoidingSystem.SharedApi.ViewModels.MessageTemplate;

public class TemplateSettingViewModel
{
    public IEnumerable<TemplateModel> MessageTemplates { get; set; }
    public IEnumerable<TemplateSetting> TemplateSettings { get; set; }
}