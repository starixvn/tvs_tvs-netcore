using System.Globalization;
using System.Security;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.ManageRequest.Extension;

public static class ObjectToXMLExtension
{
    private const int FILTER_BY_CHECK_TIME = 2;

    public static string ToXml(this VoidDataXmlModel voidData)
    {
        var voidDataXml = $"<VoidData Reason='{SecurityElement.Escape(voidData.Reason)}' ReasonSC='{SecurityElement.Escape(voidData.ReasonSC)}'"
                          + $" ContentChineseTraditional='{SecurityElement.Escape(voidData.ContentChineseTraditional)}'"
                          + $" ContentChineseSimplified='{SecurityElement.Escape(voidData.ContentChineseSimplified)}'"
                          + $" ContentNewChineseSimplified='{SecurityElement.Escape(voidData.ContentNewChineseSimplified)}'"
                          + $" ContentEnglish='{SecurityElement.Escape(voidData.ContentEnglish)}' ContentSpanish='{SecurityElement.Escape(voidData.ContentSpanish)}'"
                          + $" ContentItalian='{SecurityElement.Escape(voidData.ContentItalian)}' ContentJapanese='{SecurityElement.Escape(voidData.ContentJapanese)}'"
                          + $" ContentKorean='{SecurityElement.Escape(voidData.ContentKorean)}' ContentThai='{SecurityElement.Escape(voidData.ContentThai)}'"
                          + $" CreatorId='{voidData.CreatorId}' CreatorName='{voidData.CreatorName}' HistoryStatusId='{voidData.HistoryStatusId}'"
                          + $" DecidedBy='{SecurityElement.Escape(voidData.DecidedBy)}'"
                          + $" VoidFromTime='{voidData.VoidFromTime}' VoidToTime='{voidData.VoidToTime}'"
                          + $" VoidFromDate='{voidData.VoidFromDate}' VoidToDate='{voidData.VoidToDate}'"
                          + $" IsHasSettledTicket='{voidData.IsHasSettledTicket}'"
                          + $" IsRunAutoAfterVoid='{false}' />";

        return voidDataXml;
    }

    public static string ToEventWrongScoreXml(this IEnumerable<WrongScoreInfoViewModel> models) // NOSONAR
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var scores = GetLiveScore(model.FilterBy, model);
            var liveHomeScore = scores[0].Trim();
            var liveAwayScore = scores[1].Trim();
            var line = $"<r LiveHomeScore='{liveHomeScore}' "
                       + $"LiveAwayScore='{liveAwayScore}' "
                       + $"ScoreId='{model.ScoreId}' "
                       + $"AATime='{model.AATime}' "
                       + $"PATime='{model.PATime}' "
                       + $"SATime='{model.SATime}' "
                       + $"LiveScores='{model.LogInfoDetail?.LiveScores}' "
                       + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                       + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"FilterToTransTime='{model.FilterToTransTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"VoidFromTime='{model.VoidFromTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"VoidToTime='{model.VoidToTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"MatchId='{model.LogInfoDetail?.MatchId}' "
                       + $"SingleCount='{model.LogInfoDetail?.SingleCount}' "
                       + $"MainParlayCount='{model.LogInfoDetail?.MainParlayCount}' "
                       + $"ActualScore='{SecurityElement.Escape(model.ActualScore)}' "
                       + $"FilterBy='{model.FilterBy}' "
                       + $"IsCheckedVar='{model.IsCheckedVar}' "
                       + $"MinTransId='{model.LogInfoDetail?.MinTransId}' "
                       + $"ActionType='{model.LogInfoDetail?.ActionType}' "
                       + $"MinTime='{model.LogInfoDetail?.HighlightMinTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"MinType='{model.LogInfoDetail?.HighlightAcceptType}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string[] GetLiveScore(int? filterBy, WrongScoreInfoViewModel model)
    {
        if (filterBy != FILTER_BY_CHECK_TIME && model.WrongScore != null)
        {
            return model.WrongScore.Split('-');
        }

        return new[] { string.Empty, string.Empty };
    }

    public static string ToEventDangerAcceptedXml(this IEnumerable<DangerAcceptedViewModel> models) // NOSONAR
    {
        if (!models.Any())
        {
            return string.Empty;
        }
        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                + $"AATime='{model.AATime}' "
                + $"PATime='{model.PATime}' "
                + $"SATime='{model.SATime}' "
                + $"FilterBy='{model.FilterBy}' "
                + $"IsMainMatch='{model.IsMainMatch.ToString().ToLowerInvariant()}' "
                + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                + $"LiveScores='{model.LogInfoDetail?.LiveScores}' "
                + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"VoidFromTime='{model.VoidFromTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"VoidToTime='{model.VoidToTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"SingleCount='{model.LogInfoDetail?.SingleCount}' "
                + $"MainParlayCount='{model.LogInfoDetail?.MainParlayCount}' "
                + $"IsCheckedVar='{model.IsCheckedVar}' "
                + $"MinTransId='{model.LogInfoDetail?.MinTransId}' "
                + $"ActionType='{model.LogInfoDetail?.ActionType}' "
                + $"MinTime='{model.LogInfoDetail?.HighlightMinTime?.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"MinType='{model.LogInfoDetail?.HighlightAcceptType}' />";
            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToEventWrongHdpXml(this IEnumerable<WrongHdpViewModel> models) // NOSONAR
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                + $"LiveScores='{model.LogInfoDetail?.LiveScores}' "
                + $"IsMainMatch='{model.IsMainMatch.ToString().ToLowerInvariant()}' "
                + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"IsLinkGroup1X2='{model.IsLinkGroup1X2}' "
                + $"IsLinkGroupAIO ='{model.IsLinkGroupAIO}' "
                + $"LiveGameEarlySingleCount ='{model.LogInfoDetail?.LiveGameEarlySingleCount}' "
                + $"LiveGameEarlyCashOutCount='{model.LogInfoDetail?.LiveGameEarlyCashOutCount}' "
                + $"LiveGameEarlySettleCount='{model.LogInfoDetail?.LiveGameEarlySettleCount}' "
                + $"LiveGameEarlyInstantlySettleCount='{model.LogInfoDetail?.LiveGameEarlyInstantlySettleCount}' "
                + $"PoolHouseSingleCount='{model.LogInfoDetail?.PoolHouseSingleCount}' "
                + $"PoolHouseCashOutCount='{model.LogInfoDetail?.PoolHouseCashOutCount}' "
                + $"PoolHouseMainParlayCount='{model.LogInfoDetail?.PoolHouseMainParlayCount}' "
                + $"PoolHouseInstantlySettleCount='{model.LogInfoDetail?.PoolHouseInstantlySettleCount}' "
                + $"PoolHouseCheckedBetTypes='{model.PoolHouseCheckedBetTypes}' "
                + $"VoidFromTime='{model.LogInfoDetail?.VoidFromTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"VoidToTime='{model.LogInfoDetail?.VoidToTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"LiveIndicator='{model.LiveIndicator}' "
                + $"HomeFavorite='{SecurityElement.Escape(model.HomeFavorite)}' "
                + $"AwayFavorite='{SecurityElement.Escape(model.AwayFavorite)}' "
                + $"ActualMarket='{SecurityElement.Escape(model.ActualMarket)}' "
                + $"HdpValue='{SecurityElement.Escape(model.HdpValue)}' />";
            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToEventWrongOuXml(this IEnumerable<WrongOuViewModel> models) // NOSONAR
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                + $"LiveScores='{model.LogInfoDetail?.LiveScores}' "
                + $"IsMainMatch='{model.IsMainMatch.ToString().ToLowerInvariant()}' "
                + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"IsLinkGroup1X2='{model.IsLinkGroup1X2}' "
                + $"IsLinkGroupAIO ='{model.IsLinkGroupAIO}' "
                + $"LiveGameEarlySingleCount ='{model.LogInfoDetail?.LiveGameEarlySingleCount}' "
                + $"LiveGameEarlyCashOutCount='{model.LogInfoDetail?.LiveGameEarlyCashOutCount}' "
                + $"LiveGameEarlySettleCount='{model.LogInfoDetail?.LiveGameEarlySettleCount}' "
                + $"LiveGameEarlyInstantlySettleCount='{model.LogInfoDetail?.LiveGameEarlyInstantlySettleCount}' "
                + $"PoolHouseSingleCount='{model.LogInfoDetail?.PoolHouseSingleCount}' "
                + $"PoolHouseCashOutCount='{model.LogInfoDetail?.PoolHouseCashOutCount}' "
                + $"PoolHouseMainParlayCount='{model.LogInfoDetail?.PoolHouseMainParlayCount}' "
                + $"PoolHouseInstantlySettleCount='{model.LogInfoDetail?.PoolHouseInstantlySettleCount}' "
                + $"PoolHouseCheckedBetTypes='{model.PoolHouseCheckedBetTypes}' "
                + $"VoidToTime='{model.LogInfoDetail?.VoidToTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"VoidFromTime='{model.LogInfoDetail?.VoidFromTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                + $"LiveIndicator='{model.LiveIndicator}' "
                + $"ActualMarket='{SecurityElement.Escape(model.ActualMarket)}' "
                + $"WrongMarket='{SecurityElement.Escape(model.WrongMarket)}' />";
            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToEventWrongOddsXml(this IEnumerable<WrongOddsViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                       + $"LiveScores='{model.LogInfoDetail.LiveScores}' "
                       + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                       + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"IsLinkGroup1X2='{model.IsLinkGroup1X2}' "
                       + $"IsLinkGroupAIO ='{model.IsLinkGroupAIO}' "
                       + $"LiveGameEarlySingleCount ='{model.LogInfoDetail.LiveGameEarlySingleCount}' "
                       + $"LiveGameEarlyCashOutCount='{model.LogInfoDetail.LiveGameEarlyCashOutCount}' "
                       + $"LiveGameEarlySettleCount='{model.LogInfoDetail.LiveGameEarlySettleCount}' "
                       + $"LiveGameEarlyInstantlySettleCount='{model.LogInfoDetail.LiveGameEarlyInstantlySettleCount}' "
                       + $"PoolHouseSingleCount='{model.LogInfoDetail.PoolHouseSingleCount}' "
                       + $"PoolHouseCashOutCount='{model.LogInfoDetail.PoolHouseCashOutCount}' "
                       + $"PoolHouseMainParlayCount='{model.LogInfoDetail.PoolHouseMainParlayCount}' "
                       + $"PoolHouseInstantlySettleCount='{model.LogInfoDetail.PoolHouseInstantlySettleCount}' "
                       + $"PoolHouseCheckedBetTypes='{model.PoolHouseCheckedBetTypes}' "
                       + $"VoidToTime='{model.LogInfoDetail.VoidToTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"VoidFromTime='{model.LogInfoDetail.VoidFromTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
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
                       + $"FavoriteValue='{SecurityElement.Escape(model.FavoriteValue)}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToEventReducedOverXml(this IEnumerable<ReducedOverViewModel> models)
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
                       + $"WicketOver='{SecurityElement.Escape(model.WicketOver)}' "
                       + $"FilterWicketOver='{SecurityElement.Escape(model.FilterWicketOver)}' "
                       + $"PlayerIds='{model.PlayerIds}' "
                       + $"Runs='{SecurityElement.Escape(model.Runs)}' "
                       + $"Live='{model.Live}' "
                       + $"NonLive='{model.NonLive}' "
                       + $"SingleCount ='{model.LogInfoDetail.SingleCount}' "
                       + $"MainParlayCount='{model.LogInfoDetail.MainParlayCount}' "
                       + $"VoidToTime='{model.LogInfoDetail.VoidToTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"VoidFromTime='{model.LogInfoDetail.VoidFromTime.ToString(FormatKey.DateTimeWithMillisecond)}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToEventNotParticipateXml(this IEnumerable<NotParticipateViewModel> models)
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
                       + $"BetTypeIds='{model.BetTypeIds}' "
                       + $"SingleCount ='{model.LogInfoDetail.SingleCount}' "
                       + $"MainParlayCount='{model.LogInfoDetail.MainParlayCount}' "
                       + $"VoidToTime='{model.LogInfoDetail.VoidToTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
                       + $"VoidFromTime='{model.LogInfoDetail.VoidFromTime.ToString(FormatKey.DateTimeWithMillisecond)}' />";

            stringBuilder.AppendLine(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToAbnormalAccountXml(this AbnormalAccountViewModel model)
    {
        var stringBuilder = $"<r Usernames='{model.Usernames}' "
                            + $"ProductIds='{model.ProductIds}' "
                            + $"StatusIds='{model.StatusIds}' "
                            + $"FromDate='{model.FromDate?.ToString(CultureInfo.InvariantCulture)}' "
                            + $"ToDate='{model.ToDate?.ToString(CultureInfo.InvariantCulture)}' />";

        return $"<root>{stringBuilder.Trim()}</root>";
    }

    public static string ToDuplicateTicketsXml(this DuplicateTicketsViewModel model)
    {
        var stringBuilder = $"<r FilterBy='{model.FilterBy}' "
                            + $"MatchId='{model.MatchId}' "
                            + $"OrgTransIds='{model.OrgTransIds}' "
                            + $"SubIssueTypeId='{model.SubIssueTypeId}' />";

        return $"<root>{stringBuilder.Trim()}</root>";
    }

    public static string ToEventKickOffXml(this IEnumerable<EarlyKickOffViewModel> models)
    {
        if (!models.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in models)
        {
            var line = $"<r MatchId='{model.MatchId}' "
                       + $"IsMainMatch='{model.IsMainMatch.ToString().ToLowerInvariant()}' "
                       + $"SubIssueTypeId='{model.SubIssueTypeId}' "
                       + $"KickOffTime='{model.KickOffTime?.ZoneCanada().ToString(CultureInfo.InvariantCulture)}'/>";

            stringBuilder.Append(line);
        }

        return $"<root>{stringBuilder.ToString().Trim()}</root>";
    }

    public static string ToEventRecoverTicketXml(this RecoverTicketViewModel model)
    {
        var stringBuilder = $"<r TransIds='{model.TransIds}' "
                            + $"FilterBy='{model.FilterBy}' "
                            + $"ProductIds='{model.ProductIds}' "
                            + $"SubIssueTypeId='{model.SubIssueTypeId}' />";

        return $"<root>{stringBuilder.Trim()}</root>";
    }

    public static string ToEventAbnormalBetXml(this AbnormalBetViewModel model)
    {
        var stringBuilder = $"<r TransIds='{model.TransIds}' "
                            + $"FilterBy='{model.FilterBy}' "
                            + $"SubIssueTypeId='{model.SubIssueTypeId}' />";

        return $"<root>{stringBuilder.Trim()}</root>";
    }

    public static string ToEventWrongMarketOfferedXml(this WrongMarketOfferedViewModel model)
    {
        var options = new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true
        };
        var betTypeCountJson = model.BetTypeCount.Select(x => new BetTypeCountJsonModel
        {
            BetTypeId = x.BetTypeId,
            BetTypeCount = x.BetTypeCount,
            BetId = x.BetId
        });
        var stringBuilder = $"<r MatchId = '{model.MatchId}' "
               + $"FilterFromTransTime='{model.FilterFromTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
               + $"FilterToTransTime='{model.FilterToTransTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
               + $"VoidFromTime='{model.LogInfoDetail.VoidFromTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
               + $"VoidToTime='{model.LogInfoDetail.VoidToTime.ToString(FormatKey.DateTimeWithMillisecond)}' "
               + $"SubIssueTypeId='{model.SubIssueTypeId}' "
               + $"SingleCount ='{model.LogInfoDetail.SingleCount}' "
               + $"MainParlayCount='{model.LogInfoDetail.MainParlayCount}' "
               + $"BetTypeCount='{SecurityElement.Escape(JsonSerializer.Serialize(betTypeCountJson, options))}' "
               + $"AdvancedExtraInfo='{SecurityElement.Escape(JsonSerializer.Serialize(model.BetTeamsResult, options))}' />";

        return $"<root>{stringBuilder.Trim()}</root>";
    }

    public static string OperatorToXml(this List<OperatorQuery>? operators)
    {
        if (operators is null || operators.Count <= 0)
        {
            return string.Empty;
        }
        var result = new StringBuilder();
        foreach (var item in operators)
        {
            result.AppendFormat(StringResource.OperatorXml, item.OperatorId, item.OperatorType);
        }

        return $"{result}";
    }
}