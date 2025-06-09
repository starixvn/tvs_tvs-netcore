using System.Text;
using TicketVoidingSystem.Extensions;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface DescriptionElementService
{
    string BuildKoTime(DateTime time);

    string BuildVoidTime(int? filterBy, DateTime fromDate, DateTime toDate);

    string BuildLogId(int fromId, int toId);

    string BuildMatch(string matchEvent);

    string BuildWithVarCheck(string matchEvent, bool isCheckedVar);

    string BuildLeague(string sportTypeName, string leagueName);

    string BuildTotal(int single, int? parlay, IEnumerable<string> bettypeNames);

    string BuildVoidTimeAbnormalAccount(DateTime fromDate, DateTime toDate);

    string BuildNoOfAccount(int total);

    string BuildWrongScores(int filterBy, string wrongScores);

    string BuildMixParlay(int totalTickets);

    string BuildSystemParlay(int totalTickets);

    string BuildParlay(int totalTickets);

    string BuildProducts(string products);
}

public class DescriptionElementServiceImp : DescriptionElementService
{
    private const int FILTER_BY_ACCEPTED_TIME = 2;

    public string BuildKoTime(DateTime time)
    {
        var dateFormat = time.ToString("yyyy/MM/dd hh:mm:ss tt");
        return $"<div class=\"ko-time\">KO Time: <span class=\"text-success\">{dateFormat}</span></div>";
    }

    public string BuildVoidTime(int? filterBy, DateTime fromDate, DateTime toDate)
    {
        var fromDateFormat = fromDate.ZoneManila().ToString("hh:mm:ss.fff tt");
        var toDateFormat = toDate.ZoneManila().ToString("hh:mm:ss.fff tt");
        var title = filterBy == FILTER_BY_ACCEPTED_TIME ? "Void Accept Time" : "Void Trans Time";
        var timeColor = filterBy == FILTER_BY_ACCEPTED_TIME ? "text-primary" : "text-success";
        return $"<div class=\"void-time\"><span class=\"{timeColor}\">{title}: {fromDateFormat} - {toDateFormat}</span></div>";
    }

    public string BuildLogId(int fromId, int toId)
    {
        var logIds = fromId == toId ? $"{fromId}" : $"{fromId}-{toId}";
        return $"<div class\"log-id\">LogID: <span class=\"text-danger\">{logIds}</span></div>";
    }

    public string BuildMatch(string matchEvent)
    {
        return $"<div class=\"match\">{matchEvent}</div>";
    }

    public string BuildWithVarCheck(string matchEvent, bool isCheckedVar)
    {
        var checkVarValue = isCheckedVar ? "<span class=\"text-danger var-check\"><strong>VAR</strong> - </span>" : string.Empty;
        return $"<div>{checkVarValue}<span class=\"match\">{matchEvent}</span></div>";
    }

    public string BuildLeague(string sportTypeName, string leagueName)
    {
        return $"<div class=\"event\"><span class=\"sport\">{sportTypeName} </span><span class=\"league text-uppercase\">{leagueName}</span></div>";
    }

    public string BuildTotal(int single, int? parlay, IEnumerable<string> bettypeNames)
    {
        var sb = new StringBuilder($"Single: <span class=\"text-primary total-single\">{single}</span>");

        sb.Append(parlay.HasValue ? $", Parlay: <span class=\"text-primary total-parlay\">{parlay}</span>" : string.Empty);

        var conjunctionBettypeName = GetConjunctionBettypeName(bettypeNames);
        sb.Append(bettypeNames.Any() ? $" ({conjunctionBettypeName})" : string.Empty);

        return $"<div class=\"count-tickets\">{sb}</div>";
    }

    private static string GetConjunctionBettypeName(IEnumerable<string> bettypeNames)
    {
        const int numberOfBettypeShow = 3;
        var expectedBettypeNames = bettypeNames.Take(numberOfBettypeShow);
        var conjunctionBettypeName = string.Join(", ", expectedBettypeNames);

        return bettypeNames.Count() > numberOfBettypeShow ? $"{conjunctionBettypeName}..." : conjunctionBettypeName;
    }

    public string BuildVoidTimeAbnormalAccount(DateTime fromDate, DateTime toDate)
    {
        var fromDateFormat = fromDate.ToString("yyyy/MM/dd");
        var toDateFormat = toDate.ToString("yyyy/MM/dd");

        return $"<div class=\"void-time\">Void Time: <span class=\"text-success\">{fromDateFormat} - {toDateFormat}</span></div>";
    }

    public string BuildNoOfAccount(int total)
    {
        return $"<div class=\"no-of-account\">No. of Account: <span class=\"text-primary total-account\">{total}<span></div>";
    }

    public string BuildWrongScores(int filterBy, string wrongScores)
    {
        var voidType = filterBy == FILTER_BY_ACCEPTED_TIME ? "Void Accept Time" : "Void Trans Time";
        var textColor = filterBy == FILTER_BY_ACCEPTED_TIME ? "text-primary" : "text-success";

        return $"<div class=\"{textColor}\"><div class=\"void-wrong-score\">{voidType} - Wrong Score: <span class=\"wrong-score\">{wrongScores}<span></div></div>";
    }

    public string BuildMixParlay(int totalTickets)
    {
        return $"<div>Mix Parlay: <span class=\"text-primary total-mix-parlay\">{totalTickets}</span></div>";
    }

    public string BuildSystemParlay(int totalTickets)
    {
        return $"<div>System Parlay: <span class=\"text-primary total-system-parlay\">{totalTickets}</span></div>";
    }

    public string BuildParlay(int totalTickets)
    {
        return $"<div>Parlay: <span class=\"text-primary total-parlay\">{totalTickets}</span></div>";
    }

    public string BuildProducts(string products)
    {
        return $"<div>Product: <span class=\"text-primary product\">{products}</span></div>";
    }
}