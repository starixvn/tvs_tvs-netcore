using System.Text;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class CopyRequestInfoRequest : CopyRequestInfoCriteria, IRequest<string>
{
}

public class CopyRequestInfoHandler : IRequestHandler<CopyRequestInfoRequest, string>
{
    private readonly IDynamicRepository repository;

    public CopyRequestInfoHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<string> Handle(CopyRequestInfoRequest request, CancellationToken cancellationToken)
    {
        var model = await repository.GetAsync<CopyRequestInfoModel>(request, cancellationToken);
        var match = new Match
        {
            MatchId = request.MatchId,
            HomeId = model.HomeId,
            AwayId = model.AwayId,
            LeagueId = model.LeagueId,
            IsNeutral = model.IsNeutral
        };
        var varCheckValue = model.IsCheckedVar ? "YES" : "NO";
        var filterByValue = model.FilterBy == FilterByConstant.AcceptTime ? "Accept time" : "Trans time";

        var stringBuilder = new StringBuilder();
        stringBuilder.AppendLine($"K.O Time: {model.KickOffTime.ZoneManila():hh:mm tt}");
        stringBuilder.AppendLine($"League: {match.LeagueName}");
        stringBuilder.AppendLine($"Match: {match.MatchEvent}");
        stringBuilder.AppendLine($"Match ID: {model.MatchId}");
        stringBuilder.AppendLine($"Request No: {model.RequestId}");
        stringBuilder.AppendLine($"Issue Type: {model.IssueTypeName} - {model.SubIssueTypeName}");
        stringBuilder.AppendLine($"VAR: {varCheckValue}");
        stringBuilder.AppendLine($"Start Void Time: {model.StartVoidTime:hh:mm:ss.fff tt} ({filterByValue})");

        return stringBuilder.ToString();
    }
}