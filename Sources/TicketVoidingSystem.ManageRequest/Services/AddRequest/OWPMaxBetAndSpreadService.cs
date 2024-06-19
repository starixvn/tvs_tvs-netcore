using System.Net.Mime;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface OWPMaxBetAndSpreadService
{
    public Task<OddsInfoModel> GetMaxBetAndSpread(OddsInfoRequest request);
}

public class OWPMaxBetAndSpreadServiceImp : OWPMaxBetAndSpreadService
{
    private readonly HttpClient httpClient;
    private readonly LoggingService loggingService;

    public OWPMaxBetAndSpreadServiceImp(HttpClient httpClient, LoggingService loggingService)
    {
        this.loggingService = loggingService;
        this.httpClient = httpClient;
        this.httpClient.BaseAddress = new Uri(AppSettingService.AppSetting.OWPUrl);
        this.httpClient.DefaultRequestHeaders.Clear();
        this.httpClient.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
    }

    public async Task<OddsInfoModel> GetMaxBetAndSpread(OddsInfoRequest query)
    {
        query.SubType = 2101;
        query.SubIssueTypeId = SubIssueTypeConstant.Handicap;
        var actionName = query.MatchId.Equals(query.ParentId)
            ? $"api/maxbet/{query.ParentId}"
            : $"api/maxbet/{query.ParentId}/{query.SubType}";

        var response = await httpClient.GetAsync(actionName);
        var maxBetInfo = await Helper.DeserializeResponseStream<OWPMaxBetAndSpreadInfo>(response);
        if (response.IsSuccessStatusCode)
        {
            return GetOddsInfoViewModel(maxBetInfo, query.SubIssueTypeId);
        }

        await loggingService.ErrorAsync($"URL: {AppSettingService.AppSetting.OWPUrl}{actionName}{Environment.NewLine}Response:{Environment.NewLine}{response}");
        return new OddsInfoModel();
    }

    private static OddsInfoModel GetOddsInfoViewModel(OWPMaxBetAndSpreadInfo maxBetInfo, int subIssueTypeId)
    {
        return new OddsInfoModel
        {
            MatchId = maxBetInfo.AdminSiteID,
            Spread = GetMaxBetForSubIssueType(maxBetInfo.Spread, subIssueTypeId),
            MaxBet = (int)GetMaxBetForSubIssueType(maxBetInfo.Maxbet, subIssueTypeId)
        };
    }

    private static decimal GetMaxBetForSubIssueType(SubIssueTypeWrongOdds maxBet, int subIssueTypeId)
    {
        return subIssueTypeId switch
        {
            SubIssueTypeConstant.Handicap => maxBet.Handicap,
            SubIssueTypeConstant.FirstHalfHandicap => maxBet.FirstHalfHandicap,
            SubIssueTypeConstant.OverUnder => maxBet.OverUnder,
            _ => maxBet.FirstHalfOverUnder,
        };
    }
}