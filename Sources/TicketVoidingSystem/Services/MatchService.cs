using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services
{
    public interface MatchService
    {
        Match UpdateDataFromRemotingRef(Match match);
    }

    public class MatchServiceImp : MatchService
    {
        private readonly RemotingRefWrapperService remotingRefWrapperService;

        public MatchServiceImp(RemotingRefWrapperService remotingRefWrapperService)
        {
            this.remotingRefWrapperService = remotingRefWrapperService;
        }

        public Match UpdateDataFromRemotingRef(Match match)
        {
            if (match == null)
            {
                return null;
            }

            match.HomeName = match.IsNeutral ?
                remotingRefWrapperService.GetTeamName(match.HomeId, LanguageCode.English) + " (N)" : remotingRefWrapperService.GetTeamName(match.HomeId, LanguageCode.English);

            match.HomeNameSimplified = match.IsNeutral ?
            remotingRefWrapperService.GetTeamName(match.HomeId, LanguageCode.ChineseSimplified) + " (中)" : remotingRefWrapperService.GetTeamName(match.HomeId, LanguageCode.ChineseSimplified);

            match.HomeNameNewSimplified = match.IsNeutral ?
            remotingRefWrapperService.GetTeamName(match.HomeId, LanguageCode.NewChineseSimplified) + " (中)" : remotingRefWrapperService.GetTeamName(match.HomeId, LanguageCode.NewChineseSimplified);

            match.HomeNameTraditional = match.IsNeutral ?
            remotingRefWrapperService.GetTeamName(match.HomeId, LanguageCode.ChineseTraditional) + " (中)" : remotingRefWrapperService.GetTeamName(match.HomeId, LanguageCode.ChineseTraditional);

            match.AwayName = remotingRefWrapperService.GetTeamName(match.AwayId, LanguageCode.English);
            match.AwayNameSimplified = remotingRefWrapperService.GetTeamName(match.AwayId, LanguageCode.ChineseSimplified);
            match.AwayNameNewSimplified = remotingRefWrapperService.GetTeamName(match.AwayId, LanguageCode.NewChineseSimplified);
            match.AwayNameTraditional = remotingRefWrapperService.GetTeamName(match.AwayId, LanguageCode.ChineseTraditional);
            match.LeagueName = remotingRefWrapperService.GetLeagueName(match.LeagueId, LanguageCode.English);
            match.LeagueNameSimplified = remotingRefWrapperService.GetLeagueName(match.LeagueId, LanguageCode.ChineseSimplified);
            match.LeagueNameNewSimplified = remotingRefWrapperService.GetLeagueName(match.LeagueId, LanguageCode.NewChineseSimplified);
            match.LeagueNameTraditional = remotingRefWrapperService.GetLeagueName(match.LeagueId, LanguageCode.ChineseTraditional);
            match.MatchEvent = match.SportType switch
            {
                161 => StringResource.NumberGameNo + match.MatchCode,
                164 => $"Happy 5 No .{match.MatchCode}",
                160 => $"Lucky 3 Game No.{match.MatchCode}",
                207 => $"{remotingRefWrapperService.GetBFName(match.HomeId)} - vs - {remotingRefWrapperService.GetBFName(match.AwayId)}",
                _ => match.IsOutright ? $"{match.HomeName} - {match.LeagueName}" : $"{match.HomeName} - vs - {match.AwayName}"
            };

            match.MatchEventSimplified = GetMatchEventSimplified(match.SportType, match.IsOutright, match.HomeNameSimplified, match.AwayNameSimplified, match.LeagueNameSimplified);
            match.MatchEventNewSimplified = GetMatchEventNewSimplified(match.SportType, match.IsOutright, match.HomeNameNewSimplified, match.AwayNameNewSimplified, match.LeagueNameNewSimplified);
            match.SportTypeName = remotingRefWrapperService.GetSportName(match.SportType.ToString(), LanguageCode.English);
            match.SportTypeNameSimplified = remotingRefWrapperService.GetSportName(match.SportType.ToString(), LanguageCode.ChineseSimplified);
            match.SportTypeNameNewSimplified = remotingRefWrapperService.GetSportName(match.SportType.ToString(), LanguageCode.NewChineseSimplified);
            match.SportTypeNameTraditional = remotingRefWrapperService.GetSportName(match.SportType.ToString(), LanguageCode.ChineseTraditional);

            return match;
        }

        private static string GetMatchEventSimplified(int sportType, bool isOutright, string homeNameSimplified, string awayNameSimplified, string leagueNameSimplified)
        {
            if (sportType == 161 || sportType == 160 || sportType == 207)
            {
                return string.Empty;
            }

            return isOutright ? $"{homeNameSimplified} - {leagueNameSimplified}" : $"{homeNameSimplified} - vs - {awayNameSimplified}";
        }

        private static string GetMatchEventNewSimplified(int sportType, bool isOutright, string homeNameNewSimplified, string awayNameNewSimplified, string leagueNameNewSimplified)
        {
            if (sportType == 161 || sportType == 160 || sportType == 207)
            {
                return string.Empty;
            }

            return isOutright ? $"{homeNameNewSimplified} - {leagueNameNewSimplified}" : $"{homeNameNewSimplified} - vs - {awayNameNewSimplified}";
        }
    }
}