using System;
using System.Text.Json.Serialization;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web.JsonConverter;

namespace TicketVoidingSystem.Models
{
    public class Match
    {
        private readonly RemotingRefWrapperService remotingRefWrapperService;

        public Match(RemotingRefWrapperService remotingRefWrapperService)
        {
            this.remotingRefWrapperService = remotingRefWrapperService;
        }

        public int MatchId { get; set; }

        public int HomeId { get; set; }

        public string HomeName => IsNeutral ?
            remotingRefWrapperService.GetTeamName(HomeId, LanguageCode.English) + " (N)" : remotingRefWrapperService.GetTeamName(HomeId, LanguageCode.English);

        public string HomeNameSimplified => IsNeutral ?
            remotingRefWrapperService.GetTeamName(HomeId, LanguageCode.ChineseSimplified) + " (中)" : remotingRefWrapperService.GetTeamName(HomeId, LanguageCode.ChineseSimplified);

        public string HomeNameNewSimplified => IsNeutral ?
            remotingRefWrapperService.GetTeamName(HomeId, LanguageCode.NewChineseSimplified) + " (中)" : remotingRefWrapperService.GetTeamName(HomeId, LanguageCode.NewChineseSimplified);

        public string HomeNameTraditional => IsNeutral ?
            remotingRefWrapperService.GetTeamName(HomeId, LanguageCode.ChineseTraditional) + " (中)" : remotingRefWrapperService.GetTeamName(HomeId, LanguageCode.ChineseTraditional);

        public int AwayId { get; set; }

        public string AwayName => remotingRefWrapperService.GetTeamName(AwayId, LanguageCode.English);

        public string AwayNameSimplified => remotingRefWrapperService.GetTeamName(AwayId, LanguageCode.ChineseSimplified);

        public string AwayNameNewSimplified => remotingRefWrapperService.GetTeamName(AwayId, LanguageCode.NewChineseSimplified);

        public string AwayNameTraditional => remotingRefWrapperService.GetTeamName(AwayId, LanguageCode.ChineseTraditional);

        public string MatchCode { get; set; }

        public DateTime EventDate { get; set; }

        public DateTime DateTime { get; set; }

        public int LeagueId { get; set; }

        public int LeagueGroupId { get; set; }

        public string LeagueName => remotingRefWrapperService.GetLeagueName(LeagueId, LanguageCode.English);

        public string LeagueNameSimplified => remotingRefWrapperService.GetLeagueName(LeagueId, LanguageCode.ChineseSimplified);

        public string LeagueNameNewSimplified => remotingRefWrapperService.GetLeagueName(LeagueId, LanguageCode.NewChineseSimplified);

        public string LeagueNameTraditional => remotingRefWrapperService.GetLeagueName(LeagueId, LanguageCode.ChineseTraditional);

        public bool IsOutright { get; set; }

        public string MatchEvent
        {
            get
            {
                switch (SportType)
                {
                    case 161:
                        return StringResource.NumberGameNo + MatchCode;

                    case 164:
                        return $"Happy 5 No .{MatchCode}";

                    case 160:
                        return $"Lucky 3 Game No.{MatchCode}";

                    case 207:
                        return $"{remotingRefWrapperService.GetBFName(HomeId)} - vs - {remotingRefWrapperService.GetBFName(AwayId)}";

                    default:
                        return IsOutright ? $"{HomeName} - {LeagueName}" : $"{HomeName} - vs - {AwayName}";
                }
            }
        }

        public string MatchEventSimplified
        {
            get
            {
                if (SportType == 161 || SportType == 160 || SportType == 207)
                {
                    return string.Empty;
                }

                return IsOutright ? $"{HomeNameSimplified} - {LeagueNameSimplified}" : $"{HomeNameSimplified} - vs - {AwayNameSimplified}";
            }
        }

        public string MatchEventNewSimplified
        {
            get
            {
                if (SportType == 161 || SportType == 160 || SportType == 207)
                {
                    return string.Empty;
                }

                return IsOutright ? $"{HomeNameNewSimplified} - {LeagueNameNewSimplified}" : $"{HomeNameNewSimplified} - vs - {AwayNameNewSimplified}";
            }
        }

        public bool IsNeutral { get; set; }

        public string ShowTime { get; set; }

        [JsonConverter(typeof(GMT8DateTimeJsonConverter))]
        public DateTime KickOffTime { get; set; }

        public int SportType { get; set; }

        public string SportTypeName => remotingRefWrapperService.GetSportName(SportType.ToString(), LanguageCode.English);

        public string SportTypeNameSimplified => remotingRefWrapperService.GetSportName(SportType.ToString(), LanguageCode.ChineseSimplified);

        public string SportTypeNameNewSimplified => remotingRefWrapperService.GetSportName(SportType.ToString(), LanguageCode.NewChineseSimplified);

        public string SportTypeNameTraditional => remotingRefWrapperService.GetSportName(SportType.ToString(), LanguageCode.ChineseTraditional);
    }
}