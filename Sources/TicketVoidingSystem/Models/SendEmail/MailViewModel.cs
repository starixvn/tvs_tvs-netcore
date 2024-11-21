using System;
using System.Collections.Generic;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Models.SendEmail;

public class MailViewModel
{
    public DateTime DateTime { get; set; }

    public string ActorUsername { get; set; }

    public string TemplatePath { get; set; }

    public string NegativeBalanceUsers { get; set; }
}

public class MailVoidViewModel : MailViewModel
{
    public Match Match { get; set; }

    public string VoidReason { get; set; }

    public string VoidReasonSC { get; set; }

    public Message Message { get; set; }

    public Message SpecialMessageAfterVoidService { get; set; }

    public string ChineseSimplified => string.IsNullOrWhiteSpace(Message.ContentChineseSimplified) ? null : Message.ContentChineseSimplified.Replace("@@", "");

    public string English => string.IsNullOrWhiteSpace(Message.ContentEnglish) ? null : Message.ContentEnglish.Replace("@@", "");

    public int IssueTypeId { get; set; }

    public bool IsFilterByUserName { get; set; }

    public bool IsAbnormalBet => Helper.IsAbnormalBet(IssueTypeId);

    public bool IsAbnormalAccount => Helper.IsAbnormalAccount(IssueTypeId);

    public IList<Group<TicketEmailViewModel>> GroupTickets { get; set; }
}

public class DuplicateTicketsMailVoidViewModel
{
    public ContentByLanguageModel SportType { get; set; }

    public string TemplatePath { get; set; }

    public Match Match { get; set; }

    public Message Message { get; set; }

    public string ChineseSimplified => string.IsNullOrWhiteSpace(Message.ContentChineseSimplified) ? null : Message.ContentChineseSimplified.Replace("@@", "");

    public string English => string.IsNullOrWhiteSpace(Message.ContentEnglish) ? null : Message.ContentEnglish.Replace("@@", "");

    public int TotalOrgTransIds { get; set; }

    public IList<DuplicateTicketsRequestInfo> DuplicateTickets { get; set; }

    public string ContactAddress { get; set; }

    public string DepartmentName { get; set; }
}

public class MailRecoverViewModel : MailViewModel
{
    public IList<Group<TicketRecoverEmailViewModel>> Groups { get; set; }
}