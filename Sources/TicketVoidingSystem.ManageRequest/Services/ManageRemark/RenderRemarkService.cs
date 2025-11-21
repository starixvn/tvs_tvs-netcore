using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using RemarkModel = TicketVoidingSystem.ManageRequest.Models.ManageRemark.RemarkModel;


namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface RenderRemarkService
{
    void UpdateDescription(IEnumerable<RemarkModel> remarks);
    void UpdateActionName(IEnumerable<RemarkModel> remarks);
}

public class RenderRemarkServiceImp(RemotingRefWrapperService remotingRefWrapperService, MatchService matchService,
    DescriptionElementService elementService) : RenderRemarkService
{
    public void UpdateDescription(IEnumerable<RemarkModel> remarks)
    {
        foreach (var remark in remarks)
        {
            UpdateDescription(remark);
        }
    }

    private void UpdateDescription(RemarkModel remark)
    {
        var homeName = remotingRefWrapperService.GetTeamName(remark.SportType, remark.HomeId, LanguageCode.English);
        var awayName = remotingRefWrapperService.GetTeamName(remark.SportType, remark.AwayId, LanguageCode.English);
        remark.SportTypeName = remotingRefWrapperService.GetSportName(remark.SportType.ToString(), LanguageCode.English);
        remark.LeagueName = remotingRefWrapperService.GetLeagueName(remark.SportType, remark.LeagueId, LanguageCode.English);
        remark.DescriptionInput = remark.Description;

        var match = new Match
        {
            SportType = remark.SportType,
            MatchCode = remark.MatchCode,
            HomeId = remark.HomeId,
            AwayId = remark.AwayId,
            HomeName = homeName,
            AwayName = awayName,
            LeagueName = remark.LeagueName
        };

        remark.EventName = matchService.GetMatchEvent(match);
        remark.Description = BuildDescription(remark, remark.EventName, remark.SportTypeName, remark.LeagueName);
    }

    private string BuildDescription(RemarkModel remark, string matchEvent, string sportTypeName, string leagueName)
    {
        var description = $"<div class=\"text-primary\">{remark.Description}</div>";
        var checkVarValue = remark.IsCheckedVar ? "<span class=\"text-danger var-check\"><strong>VAR</strong> - </span>" : string.Empty;
        var match = $"<span class=\"match\">{matchEvent}</span>";
        var league = elementService.BuildLeague(sportTypeName, leagueName);

        return $"{description}{checkVarValue}{match}{league}";
    }

    public void UpdateActionName(IEnumerable<RemarkModel> remarks)
    {
        foreach (var remark in remarks)
        {
            var actionName = ActionRemarkConstant.ActionRemark.GetValueOrDefault(remark.ActionId, "");
            var actionColor = ActionRemarkConstant.ActionRemarkColor.GetValueOrDefault(remark.ActionId, "");
            remark.ActionName = $"<span class=\"{actionColor}\">{actionName}</span>";
        }

    }
}

