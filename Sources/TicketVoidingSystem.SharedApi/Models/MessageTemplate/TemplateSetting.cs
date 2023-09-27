namespace TicketVoidingSystem.SharedApi.Models.MessageTemplate;

public class TemplateSetting
{
    public int TemplateId { get; set; }
    public int SubIssueTypeId { get; set; }
    public int? SportType { get; set; }
    public bool? IsCheckedVar { get; set; }
}