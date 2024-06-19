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

    public async Task<OddsInfoModel> GetMaxBetAndSpread(OddsInfoRequest request)
    {
        request.SubType = 2000;
        var actionName = request.MatchId.Equals(request.ParentId)
            ? $"api/maxbet/{request.ParentId}"
            : $"api/maxbet/{request.ParentId}/{request.SubType}";

        var response = await httpClient.GetAsync(actionName);
        if (response.IsSuccessStatusCode)
        {
            var maxBetInfo = await Helper.DeserializeResponseStream<OWPMaxBetAndSpreadInfo>(response);
            return GetOddsInfoViewModel(maxBetInfo, request.SubIssueTypeId);
        }

        await loggingService.ErrorAsync($"URL: {AppSettingService.AppSetting.OWPUrl}{actionName}{Environment.NewLine}Response:{Environment.NewLine}{response}");
        return new OddsInfoModel();
    }

    private static OddsInfoModel GetOddsInfoViewModel(OWPMaxBetAndSpreadInfo maxBetInfo, int subIssueTypeId)
    {
        return new OddsInfoModel
        {
            ParentId = maxBetInfo.AdminSiteID,
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