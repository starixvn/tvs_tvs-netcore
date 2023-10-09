using System.Collections.Generic;

namespace TicketVoidingSystem.Models.SendEmail;

public class MailRecoverViewModel<TViewModel> : MailViewModel
{
    public List<Group<TViewModel>> Groups { get; set; }
}

public class MailModel<TModel>
{
    public SiteEmail Site { get; set; }

    public List<TModel> Tickets { get; set; }
}

public class MailRecoverModel<TViewModel, TModel> : MailModel<TModel>
{
    public MailRecoverViewModel<TViewModel> ViewModel { get; set; }
}