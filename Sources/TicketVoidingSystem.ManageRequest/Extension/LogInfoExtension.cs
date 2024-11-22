using System.Globalization;
using System.Security;
using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Utilities;

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
                + $"FilterFromTransTime='{model.FilterFromTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
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
                + $"FilterFromTransTime='{model.FilterFromTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
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
                + $"FilterFromTransTime='{model.FilterFromTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
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
                       + $"FilterFromTransTime='{model.FilterFromTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
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
                       + $"FilterFromTransTime='{model.FilterFromTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                       + $"LiveIndicator='{model.LiveIndicator}' "
                       + $"FilterFavoriteType='{SecurityElement.Escape(model.FilterFavoriteType)}' "
                       + $"FavoriteValue='{SecurityElement.Escape(model.FavoriteValue)}' "
                       + $"PoolHouseCheckedBetTypes='{model.PoolHouseCheckedBetTypes}' "
                       + $"IsLinkGroup1X2='{model.IsLinkGroup1X2}' "
                       + $"IsLinkGroupAIO ='{model.IsLinkGroupAIO}' "
                       + $"WrongOU='{SecurityElement.Escape(model.WrongOU)}' "
                       + $"Spread='{SecurityElement.Escape(model.Spread)}' "
                       + $"AllowanceRate='{SecurityElement.Escape(model.AllowanceRate)}' "
                       + $"CorrectOddsHomeOver='{SecurityElement.Escape(model.CorrectOddsHomeOver)}' "
                       + $"CorrectOddsAwayUnder='{SecurityElement.Escape(model.CorrectOddsAwayUnder)}' "
                       + $"FromOddsNotVoidHomeOver='{SecurityElement.Escape(model.FromOddsNotVoidHomeOver)}' "
                       + $"ToOddsNotVoidHomeOver='{SecurityElement.Escape(model.ToOddsNotVoidHomeOver)}' "
                       + $"FromOddsNotVoidAwayUnder='{SecurityElement.Escape(model.FromOddsNotVoidAwayUnder)}' "
                       + $"ToOddsNotVoidAwayUnder='{SecurityElement.Escape(model.ToOddsNotVoidAwayUnder)}' />";

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
                       + $"PlayerId='{model.PlayerId}' "
                       + $"BetTypeIds='{model.BetTypeIds}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToAbnormalAccountInfoXml(this AbnormalAccountViewModel model)
    {
        return $"<root><r Usernames='{model.Usernames}' "
               + $"ProductIds='{model.ProductIds}' "
               + $"StatusIds='{model.StatusIds}' "
               + $"FromDate='{model.FromDate}' "
               + $"ToDate='{model.ToDate}' "
               + $"IsVoidAllArchivedTickets='{model.IsVoidAllArchivedTickets}'/></root>";
    }

    public static string ToKickOffInfoXml(this IEnumerable<EarlyKickOffViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                       + $"KickOffTime='{model.KickOffTime?.ZoneCanada().ToString(CultureInfo.InvariantCulture)}'/>";

            stringBuilder.Append(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToWrongMarketOfferedInfoXml(this WrongMarketOfferedViewModel model)
    {
        return $"<root><r MatchId = '{model.MatchId}' "
                + $"FilterFromTransTime='{model.FilterFromTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                + $"AdvancedExtraInfo='{SecurityElement.Escape(Helper.JsonSerializerIgnoreNullValue(model.BetTeamsResult))}'/></root>";
    }

    public static string ToWrongOddsSportsBookInfoXml(this WrongOddsSportsBookViewModel model)
    {
        return $"<root><r MatchId = '{model.MatchId}' "
            + $"FilterFromTransTime='{model.FilterFromTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
            + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
            + $"SubIssueTypeId='{model.SubIssueTypeId}' "
            + $"LiveIndicator='{model.LiveIndicator}' "
            + $"FilterOddsType='{SecurityElement.Escape(model.FilterOddsType)}' "
            + $"OddsValue='{SecurityElement.Escape(model.OddsValue)}' "
            + $"FromOdds='{SecurityElement.Escape(model.FromOdds)}' "
            + $"ToOdds='{SecurityElement.Escape(model.ToOdds)}' "
            + $"CorrectOdds='{SecurityElement.Escape(model.CorrectOdds)}' "
            + $"AdvancedExtraInfo='{SecurityElement.Escape(Helper.JsonSerializerIgnoreNullValue(model.BetTeamsResult))}'/></root>";
    }

    public static string ToWrongOfferedNameInfoXml(this WrongOfferedNameViewModel model)
    {
        return $"<root><r MatchId = '{model.MatchId}' "
               + $"CurrencyIds='{model.CurrencyIds}' "
               + $"LicenseeNames='{model.LicenseeNames}' "
               + $"SubIssueTypeId='{model.SubIssueTypeId}'/></root>";
    }

    public static string ToOtherIssuesInfoXml(this OtherIssuesViewModel model)
    {
        return $"<root><r MatchId = '{model.MatchId}' "
               + $"SubIssueTypeId='{model.SubIssueTypeId}' "
               + $"FilterFromTransTime='{model.FilterFromTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
               + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
               + $"AdvancedExtraInfo='{SecurityElement.Escape(Helper.JsonSerializerIgnoreNullValue(model.BetTeamsResult))}'/></root>";
    }
}