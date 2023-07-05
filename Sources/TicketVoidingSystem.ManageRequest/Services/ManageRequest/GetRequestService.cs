using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetRequestService
{
    Task<RequestDetailViewModel> GetRequest(GetRequestRequest request);
}

public class GetRequestServiceImp : GetRequestService
{
    private readonly IDynamicRepository repository;
    private readonly RemotingRefWrapperService remotingRefService;

    public GetRequestServiceImp(IDynamicRepository repository, RemotingRefWrapperService remotingRefService)
    {
        this.repository = repository;
        this.remotingRefService = remotingRefService;
    }

    public async Task<RequestDetailViewModel> GetRequest(GetRequestRequest request)
    {
        var (firstResultSet, secondResultSet, thirdResultSet) = await repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request);
        var viewModel = new RequestDetailViewModel
        {
            Request = firstResultSet.FirstOrDefault(),
            Messages = thirdResultSet
        };

        switch (firstResultSet.FirstOrDefault().IssueTypeId)
        {
            case IssueTypeConstant.WrongScore:
                viewModel.WrongScoreModels = MapEventWrongScores(secondResultSet);
                break;

            case IssueTypeConstant.DangerAccepted:
                viewModel.DangerAcceptedModels = MapEventDangerAccepted(secondResultSet);
                break;

            case IssueTypeConstant.RedCard:
                viewModel.RedCardModels = MapEventDangerAccepted(secondResultSet);
                break;

            case IssueTypeConstant.WrongHDP:
            case IssueTypeConstant.Wrong1stHDP:
                viewModel.WrongHdpModels = MapEventWrongHdp(secondResultSet);
                break;

            case IssueTypeConstant.WrongOU:
            case IssueTypeConstant.Wrong1stOU:
                viewModel.WrongOuModels = MapEventWrongOu(secondResultSet);
                break;

            case IssueTypeConstant.WrongOdds:
                viewModel.WrongOddsModels = MapEventWrongOdds(secondResultSet);
                break;

            default:
                viewModel.Event = secondResultSet.FirstOrDefault();
                break;
        }

        return viewModel;
    }

    private static IEnumerable<WrongScoreInfoViewModel> MapEventWrongScores(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new WrongScoreInfoViewModel
        {
            IsChecked = true,
            MatchId = model.MatchId,
            ScoreId = model.ScoreId,
            SubIssueTypeId = model.SubIssueTypeId,
            EventDate = model.EventDate,
            FilterBy = model.FilterBy,
            WrongScore = model.WrongScore,
            ActualScore = model.ActualScore,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            AATime = model.AATime,
            PATime = model.PATime,
            SATime = model.SATime,
            IsCheckedVar = model.IsCheckedVar
        });
    }

    private IEnumerable<DangerAcceptedViewModel> MapEventDangerAccepted(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new DangerAcceptedViewModel
        {
            MatchId = model.MatchId,
            MatchCode = model.MatchCode,
            Name = GetMatchName(model),
            LeagueName = remotingRefService.GetLeagueName(model.LeagueId, LanguageCode.English),
            IsMainMatch = model.IsMainMatch,
            SubIssueTypeId = model.SubIssueTypeId,
            EventDate = model.EventDate,
            FilterBy = model.FilterBy,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            AATime = model.AATime,
            PATime = model.PATime,
            SATime = model.SATime,
            IsCheckedVar = model.IsCheckedVar
        });
    }

    private IEnumerable<WrongHdpViewModel> MapEventWrongHdp(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new WrongHdpViewModel
        {
            MatchId = model.MatchId,
            MatchCode = model.MatchCode,
            PoolHouseCheckedBetTypes = model.PoolHouseCheckedBetTypes,
            IsLinkGroup1X2 = model.IsLinkGroup1X2,
            IsLinkGroupAIO = model.IsLinkGroupAIO,
            Name = GetMatchName(model),
            LeagueName = remotingRefService.GetLeagueName(model.LeagueId, LanguageCode.English),
            IsMainMatch = model.IsMainMatch,
            SubIssueTypeId = model.SubIssueTypeId,
            EventDate = model.EventDate,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            HomeFavorite = model.HomeFavorite,
            AwayFavorite = model.AwayFavorite,
            ActualMarket = model.ActualMarket,
            HdpValue = model.HdpValue,
            LiveIndicator = model.LiveIndicator
        });
    }

    private IEnumerable<WrongOuViewModel> MapEventWrongOu(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new WrongOuViewModel
        {
            MatchId = model.MatchId,
            MatchCode = model.MatchCode,
            Name = GetMatchName(model),
            LeagueName = remotingRefService.GetLeagueName(model.LeagueId, LanguageCode.English),
            IsMainMatch = model.IsMainMatch,
            SubIssueTypeId = model.SubIssueTypeId,
            EventDate = model.EventDate,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            ActualMarket = model.ActualMarket,
            WrongMarket = model.WrongMarket
        });
    }

    private static IEnumerable<WrongOddsViewModel> MapEventWrongOdds(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new WrongOddsViewModel
        {
            MatchId = model.MatchId,
            PoolHouseCheckedBetTypes = model.PoolHouseCheckedBetTypes,
            IsLinkGroup1X2 = model.IsLinkGroup1X2,
            IsLinkGroupAIO = model.IsLinkGroupAIO,
            SubIssueTypeId = model.SubIssueTypeId,
            EventDate = model.EventDate,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            LiveIndicator = model.LiveIndicator,
            FilterOddsType = model.FilterOddsType,
            FilterFavoriteType = model.FilterFavoriteType,
            FilterOuType = model.FilterOuType,
            OddsValue = model.OddsValue,
            FromOdds = model.FromOdds,
            ToOdds = model.ToOdds,
            CorrectOdds = model.CorrectOdds,
            BetTeam = model.BetTeam,
            OuValue = model.OuValue,
            FavoriteValue = model.FavoriteValue
        });
    }

    private string GetMatchName(RequestEventModel requestEventModel)
    {
        var homeName = requestEventModel.IsNeutral ?
                 remotingRefService.GetTeamName(requestEventModel.HomeId, LanguageCode.English) + " (N)" : remotingRefService.GetTeamName(requestEventModel.HomeId, LanguageCode.English);
        var awayName = remotingRefService.GetTeamName(requestEventModel.AwayId, LanguageCode.English);

        return $"{requestEventModel.MatchId} - {homeName} - vs - {awayName}";
    }
}