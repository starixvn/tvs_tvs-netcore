using System.Globalization;
using System.Security;
using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Extension;

public static class LogInfoExtension
{
    public static string ToWrongScoreInfoXml(this IEnumerable<WrongScoreInfoViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var scores = ObjectToXMLExtension.GetLiveScore(model.FilterBy, model);
            var liveHomeScore = scores[0].Trim();
            var liveAwayScore = scores[1].Trim();
            var line = $"<r LiveHomeScore='{liveHomeScore}' "
                + $"LiveAwayScore='{liveAwayScore}' "
                + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"ScoreId='{model.ScoreId}' "
                + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                + $"MatchId='{model.MatchId}' "
                + $"AATime='{model.AATime}' "
                + $"PATime='{model.PATime}' "
                + $"SATime='{model.SATime}' "
                + $"FilterBy='{model.FilterBy}'/>";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToDangerAcceptedInfoXml(this IEnumerable<DangerAcceptedViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                + $"AATime='{model.AATime}' "
                + $"PATime='{model.PATime}' "
                + $"SATime='{model.SATime}' "
                + $"FilterBy='{model.FilterBy}'/>";
            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToWrongHdpInfoXml(this IEnumerable<WrongHdpViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"IsMainMatch='{model.IsMainMatch}' "
                + $"PoolHouseCheckedBetTypes='{model.PoolHouseCheckedBetTypes}' "
                + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                + $"IsLinkGroup1X2='{model.IsLinkGroup1X2}' "
                + $"IsLinkGroupAIO ='{model.IsLinkGroupAIO}' "
                + $"LiveIndicator='{model.LiveIndicator}' "
                + $"HomeFavorite='{SecurityElement.Escape(model.HomeFavorite)}' "
                + $"AwayFavorite='{SecurityElement.Escape(model.AwayFavorite)}' "
                + $"HdpValue='{SecurityElement.Escape(model.HdpValue)}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToWrongOuInfoXml(this IEnumerable<WrongOuViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                       + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                       + $"IsMainMatch='{model.IsMainMatch}' "
                       + $"LiveIndicator='{model.LiveIndicator}' "
                       + $"PoolHouseCheckedBetTypes='{model.PoolHouseCheckedBetTypes}' "
                       + $"IsLinkGroup1X2='{model.IsLinkGroup1X2}' "
                       + $"IsLinkGroupAIO ='{model.IsLinkGroupAIO}' "
                       + $"WrongMarket='{SecurityElement.Escape(model.WrongMarket)}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToWrongOddsInfoXml(this IEnumerable<WrongOddsViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                       + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                       + $"LiveIndicator='{model.LiveIndicator}' "
                       + $"FilterOddsType='{SecurityElement.Escape(model.FilterOddsType)}' "
                       + $"FilterFavoriteType='{SecurityElement.Escape(model.FilterFavoriteType)}' "
                       + $"FilterOuType='{SecurityElement.Escape(model.FilterOuType)}' "
                       + $"OddsValue='{SecurityElement.Escape(model.OddsValue)}' "
                       + $"FromOdds='{SecurityElement.Escape(model.FromOdds)}' "
                       + $"ToOdds='{SecurityElement.Escape(model.ToOdds)}' "
                       + $"CorrectOdds='{SecurityElement.Escape(model.CorrectOdds)}' "
                       + $"BetTeam='{SecurityElement.Escape(model.BetTeam)}' "
                       + $"OuValue='{SecurityElement.Escape(model.OuValue)}' "
                       + $"FavoriteValue='{SecurityElement.Escape(model.FavoriteValue)}' "
                       + $"PoolHouseCheckedBetTypes='{model.PoolHouseCheckedBetTypes}' "
                       + $"IsLinkGroup1X2='{model.IsLinkGroup1X2}' "
                       + $"IsLinkGroupAIO ='{model.IsLinkGroupAIO}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToReducedOverInfoXml(this IEnumerable<ReducedOverViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                       + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                       + $"BetTypeIds='{model.BetTypeIds}' "
                       + $"WicketOver='{model.WicketOver}' "
                       + $"FilterWicketOver='{model.FilterWicketOver}' "
                       + $"PlayerIds='{model.PlayerIds}' "
                       + $"Runs='{model.Runs}' "
                       + $"NonLive='{model.NonLive}' "
                       + $"Live='{model.Live}' /> ";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToNotParticipateInfoXml(this IEnumerable<NotParticipateViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                       + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                       + $"BetTypeId='{model.BetTypeId}' "
                       + $"PlayerIds='{model.PlayerIds}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string GetAbnormalAccountInfoXml(string usernames, string productIds, string statusIds, DateTime? fromDate, DateTime? toDate)
    {
        return $"<root><r Usernames='{usernames}' "
                + $"ProductIds='{productIds}' "
                + $"StatusIds='{statusIds}' "
                + $"FromDate='{fromDate}' "
                + $"ToDate='{toDate}'/></root>";
    }

    public static string GetKickOffInfoXml(int? matchId, DateTime? kickOffTime)
    {
        return $"<root><r MatchId='{matchId}' KickOffTime='{kickOffTime?.ToString(CultureInfo.InvariantCulture)}'/></root>";
    }
}