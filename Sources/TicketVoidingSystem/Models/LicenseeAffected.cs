using System.Collections.Generic;

namespace TicketVoidingSystem.Models;

public class AffectedLicensee(string group, bool show, string message, string color)
{
    public string Group { get; set; } = group;
    public string LicenseesName { get; set; } = string.Empty;
    public string Message { get; set; } = message;
    public bool Show { get; set; } = show;
    public string Color { get; set; } = color;
}

public class AffectedLicenseeList
{
    public List<AffectedLicensee> LicenseeAffectedList { get; set; } =
    [
        new("normal", false, "Attn: system will notify affected tickets to these Licensee(s): ", "#0a0c0f"),
        new("chinaView", false, "China View Licensee Affected List: ", "#dd5edd"),
        new("jollyView", false, "Jolly Sports Licensee Affected List: ", "goldenrod"),
        new("jollySportCv", false, "JollySportsCV Licensee Affected List: ", "#066924"),
        new("instant", false, "Instant Payout Licensee Affected List: ", "#ff0000"),
        new("cashOut", false, "Cash Out Licensee Affected List: ", "#5548cc"),
        new("cancelCashOut", false, "Cancel Cash Out Licensee Affected List: ", "#0a0c0f"),
        new("timeMachine", false, "Time Machine Licensee Affected List: ", "#6f3096")
    ];
}