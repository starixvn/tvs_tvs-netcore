using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

public interface LogInfoWrongOuService
{
    Task<GetLogInfoViewModel> Get(GetLogInfoQuery query);
}

public class LogInfoServiceImp(
    IMapper mapper,
    IDynamicRepository repository,
    SessionService sessionService)
    : LogInfoWrongOuService
{
    public async Task<GetLogInfoViewModel> Get(GetLogInfoQuery query)
    {
        var criteria = GetLogInfoCriteria(query);
        var (validations, ticketRequests, logInfoDetails, transInfoAddRequestModels, transInfoJsonList) =
            await repository.FetchMultipleAsync<Validation, TicketRequest, LogInfoDetail, TransInfoAddRequestModel>(criteria);

        var logInfoModels = await GetLogInfoModels(query, validations, ticketRequests, logInfoDetails);
        return new GetLogInfoViewModel
        {
            GetLogInfoModels = logInfoModels,
            TransInfoAddRequestModel = transInfoAddRequestModels
        };
    }

    public async Task<> GetValidationAllServer(GetLogInfoQuery query)
    {
        var criteria = GetLogInfoCriteria(query);
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<Validation, TicketRequest, LogInfoDetail, TransInfoAddRequestModel>(criteria);
        });
        await Task.WhenAll(tasks);

        return x;
    }

    private async Task<IEnumerable<GetLogInfoModel>> GetLogInfoModels(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrongOu(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.WrongOuModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private static IEnumerable<GetLogInfoModel> GetLogInfoViewModelWrong1stOu(GetLogInfoQuery query, IEnumerable<Validation> validation,
        IEnumerable<TicketRequest> ticketRequest, IEnumerable<LogInfoDetail> logInfoDetail)
    {
        return query.Wrong1stOuModels.Select(item => new GetLogInfoModel
        {
            MatchId = item.MatchId,
            Validation = validation.FirstOrDefault(x => x.MatchId == item.MatchId),
            TicketRequest = ticketRequest.Where(x => x.MatchId == item.MatchId),
            LogInfoDetail = logInfoDetail.FirstOrDefault(x => x.MatchId == item.MatchId)
        });
    }

    private GetLogInfoWrongOuCriteria GetLogInfoCriteria(GetLogInfoQuery query)
    {
        var criteria = mapper.Map<GetLogInfoWrongOuCriteria>(query);
        criteria.UserId = sessionService.UserId;
        criteria.WrongOuInfo = query.WrongOuModels?.ToWrongOuInfoXml();
        criteria.Wrong1stOuInfo = query.Wrong1stOuModels?.ToWrongOuInfoXml();

        return criteria;
    }
}