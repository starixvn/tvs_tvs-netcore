using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.RecoverTicket;

public interface CheckRecoverTicketService
{
    Task<CheckRecoverTicketViewModel> CheckRecoverTicket(CheckRecoverTicketModel request);
}

public class CheckRecoverTicketServiceImp : CheckRecoverTicketService
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly IDynamicRepository repository;

    public CheckRecoverTicketServiceImp(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    {
        this.repository = repository;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<CheckRecoverTicketViewModel> CheckRecoverTicket(CheckRecoverTicketModel request)
    {
        var transInfoJsonList = await GetTransInfoJson(request);
        var criteria = await CreateRecoverTicketCriteria(request, transInfoJsonList);

        return await repository.GetAsync<CheckRecoverTicketViewModel>(criteria);
    }

    private static Task<CheckRecoverTicketCriteria> CreateRecoverTicketCriteria(CheckRecoverTicketModel message, IEnumerable<string> transInfoJsonList)
    {
        var criteria = new CheckRecoverTicketCriteria
        {
            TransIds = message.TransIds,
            RequestId = message.RequestId,
            FilterBy = message.FilterBy,
            ProductIds = message.ProductIds,
            TransInfoJson = string.Join(",", transInfoJsonList)
        };

        return Task.FromResult(criteria);
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(CheckRecoverTicketModel model)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = IssueTypeConstant.RecoverTicket,
            RecoverTicketModel = new RecoverTicketViewModel
            {
                TransIds = model.TransIds,
                FilterBy = model.FilterBy,
                ProductIds = model.ProductIds,
                SubIssueTypeId = model.SubIssueTypeId
            }
        };
        var transInfoJsonList = await getTransInfoService.GetTransInfoJson(getTransInfoQuery);

        return transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x));
    }
}