using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.Services.OnlineServerRepository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

public interface GetVoidTimeByAllowanceSettingService
{
    Task<IEnumerable<VoidTimeByAllowanceSetting>> Get(GetLogInfoQuery query);
}

public class GetVoidTimeByAllowanceSettingServiceImp(OnlineServerRepository onlineServerRepository) : GetVoidTimeByAllowanceSettingService
{
    public async Task<IEnumerable<VoidTimeByAllowanceSetting>> Get(GetLogInfoQuery query)
    {
        var criteria = CreateCriteria(query);
        var models = await onlineServerRepository.FetchAsync<VoidTimeByAllowanceSetting>(criteria);
        HttpContextHelper.SetExtraLog("GetVoidTimeByAllowanceSetting", models);

        return GetResults(query, models);
    }

    private static GetVoidTimeByAllowanceSettingCriteriaBase CreateCriteria(GetLogInfoQuery query)
    {
        var criteria = new GetVoidTimeByAllowanceSettingCriteriaBase
        {
            ActionId = query.ActionId,
            IssueTypeId = query.IssueTypeId,
            WrongScoreInfo = query.WrongScoreModels?.ToWrongScoreInfoXml(),
            DangerAcceptedInfo = query.DangerAcceptedModels?.ToDangerAcceptedInfoXml(),
            RedCardInfo = query.RedCardModels?.ToDangerAcceptedInfoXml()
        };

        return criteria;
    }

    private static List<VoidTimeByAllowanceSetting> GetResults(GetLogInfoQuery query, IEnumerable<VoidTimeByAllowanceSetting> models)
    {
        return query.IssueTypeId switch
        {
            IssueTypeConstant.DangerAccepted => VoidTimeByAllowanceSettingDangerAccepted(query, models),
            IssueTypeConstant.RedCard => VoidTimeByAllowanceSettingRedCard(query, models),
            IssueTypeConstant.WrongScore => VoidTimeByAllowanceSettingWrongScore(query, models),
            _ => []
        };
    }

    private static List<VoidTimeByAllowanceSetting> VoidTimeByAllowanceSettingDangerAccepted(GetLogInfoQuery query, IEnumerable<VoidTimeByAllowanceSetting> models)
    {
        return query.DangerAcceptedModels.Select(item => new VoidTimeByAllowanceSetting
        {
            MatchId = item.MatchId,
            VoidFromTime = CombineVoidFromTime(models.Where(x => x.MatchId == item.MatchId)),
            VoidToTime = CombineVoidToTime(models.Where(x => x.MatchId == item.MatchId)),
        }).ToList();
    }

    private static List<VoidTimeByAllowanceSetting> VoidTimeByAllowanceSettingRedCard(GetLogInfoQuery query, IEnumerable<VoidTimeByAllowanceSetting> models)
    {
        return query.RedCardModels.Select(item => new VoidTimeByAllowanceSetting
        {
            MatchId = item.MatchId,
            VoidFromTime = CombineVoidFromTime(models.Where(x => x.MatchId == item.MatchId)),
            VoidToTime = CombineVoidToTime(models.Where(x => x.MatchId == item.MatchId)),
        }).ToList();
    }

    private static List<VoidTimeByAllowanceSetting> VoidTimeByAllowanceSettingWrongScore(GetLogInfoQuery query, IEnumerable<VoidTimeByAllowanceSetting> models)
    {
        return query.WrongScoreModels.Select(item => new VoidTimeByAllowanceSetting
        {
            MatchId = item.MatchId,
            ScoreId = item.ScoreId,
            VoidFromTime = CombineVoidFromTime(models.Where(x => x.ScoreId == item.ScoreId && x.MatchId == item.MatchId)),
            VoidToTime = CombineVoidToTime(models.Where(x => x.ScoreId == item.ScoreId && x.MatchId == item.MatchId)),
        }).ToList();
    }

    private static DateTime? CombineVoidFromTime(IEnumerable<VoidTimeByAllowanceSetting> items)
    {
        return items.Select(x => x.VoidFromTime)
            .Where(x => x != null).Min(x => x);
    }

    private static DateTime? CombineVoidToTime(IEnumerable<VoidTimeByAllowanceSetting> items)
    {
        return items.Select(x => x.VoidToTime)
            .Where(x => x != null).Max(x => x);
    }
}