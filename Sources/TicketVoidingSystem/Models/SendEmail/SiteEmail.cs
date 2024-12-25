namespace TicketVoidingSystem.Models.SendEmail;

public class SiteEmail
{
    public int SiteId { get; set; }

    public string Site { get; set; }

    public string ToList { get; set; }

    public string CcList { get; set; }

    public string BccList { get; set; }

    public bool IsChinaView { get; set; }

    public int SpecialPlatform { get; set; }
}