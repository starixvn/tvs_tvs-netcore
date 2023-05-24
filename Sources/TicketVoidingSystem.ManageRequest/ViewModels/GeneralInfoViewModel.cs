using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class GeneralInfoViewModel
{
    public GeneralInfoModel GeneralInfoModel { get; set; }

    public IEnumerable<GroupUserVoidMessage> UserVoidMessages { get; set; }

    public IEnumerable<string> SucceedEmails { get; set; }

    public IEnumerable<string> FailedEmails { get; set; }
}