using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface RenderRemarkService
{
    void UpdateDescription(IEnumerable<RemarkModel> remarks);
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
        var leagueName = remotingRefWrapperService.GetLeagueName(remark.SportType, remark.LeagueId, LanguageCode.English);
        var sportTypeName = remotingRefWrapperService.GetSportName(remark.SportType.ToString(), LanguageCode.English);

        var match = new Match
        {
            SportType = remark.SportType,
            MatchCode = remark.MatchCode,
            HomeId = remark.HomeId,
            AwayId = remark.AwayId,
            HomeName = homeName,
            AwayName = awayName,
            LeagueName = leagueName
        };

        var matchEvent = matchService.GetMatchEvent(match);
        remark.Description = BuildDescription(remark, matchEvent, sportTypeName, leagueName);
    }

    private string BuildDescription(RemarkModel remark,string matchEvent, string sportTypeName, string leagueName)
    {
        var description = $"<div class=\"description\">{remark.Description}</div>";
        var checkVarValue = remark.IsCheckedVar ? "<div class=\"text-danger var-check\"><strong>VAR</strong> - </div>" : string.Empty;
        var match = elementService.BuildMatch(matchEvent);
        var league = elementService.BuildLeague(sportTypeName, leagueName);

        return $"{description}{checkVarValue}{match}{league}";
    }
}

