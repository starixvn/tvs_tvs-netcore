using System.Collections.Generic;

namespace TicketVoidingSystem.Models;

public class AffectedLicensee
{
    public string Group { get; set; }
    public string LicenseesName { get; set; }
    public string Message { get; set; }
    public bool Show { get; set; }
    public string Color { get; set; }
}

public class AffectedLicenseeList
{
    public List<AffectedLicensee> LicenseeAffectedList { get; set; }

    public AffectedLicenseeList()
    {
        LicenseeAffectedList = new List<AffectedLicensee>
        {
            new()
            {
                Group = "normal",
                Show = false,
                Message = "Attn: system will notify affected tickets to these Licensee(s): ",
                Color = "#0a0c0f"
            },
            new()
            {
                Group = "chinaView",
                Show = false,
                Message = "China View Licensee Affected List: ",
                Color = "#dd5edd"
            },new()
            {
                Group = "jollyView",
                Show = false,
                Message = "Jolly Sports Licensee Affected List: ",
                Color = "goldenrod"
            },new()
            {
                Group = "jollySportCv",
                Show = false,
                Message = "JollySportsCV Licensee Affected List: ",
                Color = "#066924"
            },new()
            {
                Group = "instant",
                Show = false,
                Message = "Instant OU Licensee Affected List: ",
                Color = "#ff0000"
            },new()
            {
                Group = "cashOut",
                Show = false,
                Message = "Cash Out Licensee Affected List: ",
                Color = "#5548cc"
            },new()
            {
                Group = "cancelCashOut",
                Show = false,
                Message = "Cancel Cash Out Licensee Affected List: ",
                Color = "#0a0c0f"
            }
        };
    }
}