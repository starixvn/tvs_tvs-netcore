using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.RecoverTicket;

public interface CheckRecoverTicketService
{
    Task<CheckRecoverTicketViewModel> CheckRecoverTicket(CheckRecoverTicketCriteria criteria);
}

public class CheckRecoverTicketServiceImp(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    : CheckRecoverTicketService
{
    public async Task<CheckRecoverTicketViewModel> CheckRecoverTicket(CheckRecoverTicketCriteria criteria)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.GetAsync<CheckRecoverTicketViewModel>(criteria);
        });

        var resultTasks = await Task.WhenAll(tasks);
        var model = new CheckRecoverTicketViewModel
        {
            ExistingReqTransIds = Helper.GetUnionTransIdString(resultTasks.Select(x => x.ExistingReqTransIds)),
            UnsupportedDateRangeTransIds = Helper.GetUnionTransIdString(resultTasks.Select(x => x.UnsupportedDateRangeTransIds)),
            UnMarkTransIds = Helper.GetUnionTransIdString(resultTasks.Select(x => x.UnMarkTransIds)),
            TransInfoJson = Helper.GetUnionTransIdString(resultTasks.Select(x => x.TransInfoJson)),
            InvalidTransIds = Helper.GetIntersectTransIdString(resultTasks.Select(x => x.InvalidTransIds)),
        };

        return model;
    }
}