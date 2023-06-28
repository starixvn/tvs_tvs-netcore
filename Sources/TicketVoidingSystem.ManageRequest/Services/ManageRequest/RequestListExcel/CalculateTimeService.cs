using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public interface CalculateTimeService
{
    Task<IEnumerable<GetCalculateTimeModel>> GetCalculateTime(IEnumerable<string> query);
}

public class CalculateTimeServiceImp : CalculateTimeService
{
    private readonly IDynamicRepository repository;

    public CalculateTimeServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<GetCalculateTimeModel>> GetCalculateTime(IEnumerable<string> query)
    {
        var calculateTime = new List<GetCalculateTimeModel>();
        calculateTime.AddRange(await GetCalculateTimeActive(query));
        calculateTime.AddRange(await GetCalculateTimeArchived(query));

        return calculateTime.GroupBy(model => model.RequestId)
            .Select(g => new GetCalculateTimeModel
            {
                RequestId = g.Key,
                CalcHalfTime = g.Min(model => model.CalcHalfTime),
                CalcFullTime = g.Min(model => model.CalcFullTime)
            });
    }

    private async Task<IEnumerable<GetCalculateTimeModel>> GetCalculateTimeActive(IEnumerable<string> query)
    {
        var criteria = new GetCalculateTimeCriteria
        {
            RequestInfoGetCalcTimes = string.Join(",", query)
        };
        return await repository.FetchAsync<GetCalculateTimeModel>(criteria);
    }

    private async Task<IEnumerable<GetCalculateTimeModel>> GetCalculateTimeArchived(IEnumerable<string> query)
    {
        var criteria = new GetCalculateTimeArchiveCriteria
        {
            RequestInfoGetCalcTimes = string.Join(",", query)
        };
        return await repository.FetchAsync<GetCalculateTimeModel>(criteria);
    }
}