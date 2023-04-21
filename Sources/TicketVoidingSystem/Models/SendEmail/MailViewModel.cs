using System;
using System.Collections.Generic;
using TicketVoidingSystem.Models.SendMessage;

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

    public string ChineseSimplified => string.IsNullOrWhiteSpace(Message.ContentChineseSimplified) ? null : Message.ContentChineseSimplified.Replace("@@", "");

    public string English => string.IsNullOrWhiteSpace(Message.ContentEnglish) ? null : Message.ContentEnglish.Replace("@@", "");

    public bool IsLikelyAbnormalBet { get; set; }
    public bool IsAbnormalAccount { get; set; }

    public bool IsFilterByUserName { get; set; }

    public IEnumerable<TicketEmailViewModel> Tickets { get; set; }
}