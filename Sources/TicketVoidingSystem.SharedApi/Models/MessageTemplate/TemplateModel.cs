using System.Collections.Generic;

namespace TicketVoidingSystem.SharedApi.Models.MessageTemplate;

public class InputText
{
    public string Name { get; set; }
    public string Pattern { get; set; }
    public string MsgEnglish { get; set; }
    public string MsgChineseTraditional { get; set; }
    public string MsgChineseSimplified { get; set; }
    public string MsgChineseNewSimplified { get; set; }
}

public class TemplateModel
{
    public int TemplateId { get; set; }
    public string MsgEnglish { get; set; }
    public string MsgChineseTraditional { get; set; }
    public string MsgChineseSimplified { get; set; }
    public string MsgChineseNewSimplified { get; set; }

    public string JsonValue { get; set; }

    public IEnumerable<InputText> InputTexts { get; set; }
}