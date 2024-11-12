using System.Collections.Generic;

namespace TicketVoidingSystem.Models.SendEmail;

public class CombineMessageModel
{
    public List<Result> Results { get; set; } = [];

    public List<string> SuccessfulLicensees { get; set; } = [];

    public List<string> FailedLicensees { get; set; } = [];
}