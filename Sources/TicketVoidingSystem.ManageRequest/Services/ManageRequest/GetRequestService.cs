using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetRequestService
{
    Task<RequestDetailViewModel> GetRequest(GetRequestRequest request);
}

public class GetRequestServiceImp(
    IDynamicRepository repository,
    RemotingRefWrapperService remotingRefService,
    MatchService matchService,
    IMapper mapper,
    AdvancedModeService advancedModeService,
    RequestExtraInfoXmlService requestExtraInfoXmlService)
    : GetRequestService
{
    public async Task<RequestDetailViewModel> GetRequest(GetRequestRequest request)  // NOSONAR
    {
        var (firstResultSet, secondResultSet, thirdResultSet)
            = await repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, PlayerName>(request);
        var requestInfo = firstResultSet.First();
        requestInfo.Operators = requestExtraInfoXmlService.ParseXmlToOperators(requestInfo.OperatorInfo);
        requestInfo.SportType = secondResultSet.Select(x => x.SportType).Distinct().Count() == 1
            ? secondResultSet.First().SportType : null;
        requestExtraInfoXmlService.UpdateRequestDetailProperties(requestInfo.IssueTypeId, secondResultSet);

        var viewModel = new RequestDetailViewModel
        {
            Request = requestInfo,
            PlayerNames = thirdResultSet
        };

        switch (requestInfo.IssueTypeId)
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

            case IssueTypeConstant.ReducedOver:
            case IssueTypeConstant.Abandoned:
                viewModel.ReducedOverModels = MapEventReducedOver(secondResultSet);
                break;

            case IssueTypeConstant.NotParticipate:
                viewModel.NotParticipateModels = MapEventNotParticipate(secondResultSet);
                break;

            case IssueTypeConstant.EarlyKickOffTime:
            case IssueTypeConstant.WrongKickOffTime:
                viewModel.EarlyKickOffModels = MapEventEarlyKickOff(secondResultSet);
                break;

            case IssueTypeConstant.DuplicateTickets:
                viewModel.DuplicateTicketsModel = MapEventDuplicateTickets(secondResultSet);
                break;

            case IssueTypeConstant.AbnormalAccount:
                viewModel.AbnormalAccountModel = MapEventAbnormalAccount(secondResultSet);
                break;

            case IssueTypeConstant.RecoverTicket:
                viewModel.RecoverTicketModel = MapEventRecoverTicket(secondResultSet);
                break;

            case IssueTypeConstant.AbnormalBet:
                viewModel.AbnormalBetModel = MapEventAbnormalBet(secondResultSet);
                break;

            case IssueTypeConstant.WrongMarketOffered:
                viewModel.WrongMarketOfferedModels = await MapEventWrongMarketOffered(secondResultSet);
                break;

            case IssueTypeConstant.WrongOddsSportsBook:
                viewModel.WrongOddsSportsBookModel = await MapEventWrongOddsSportsBook(secondResultSet);
                break;

            case IssueTypeConstant.WrongOfferedName:
                viewModel.WrongOfferedNameModel = MapEventWrongOfferedName(secondResultSet);
                break;

            case IssueTypeConstant.OtherIssues:
                viewModel.OtherIssuesModel = await MapEventOtherIssues(secondResultSet);
                break;

            case IssueTypeConstant.TechnicalError:
                viewModel.TechnicalErrorModel = await MapEventTechnicalError(secondResultSet);
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
            IsCheckedVar = model.IsCheckedVar,
            TvDetectionValue = model.TvDetectionValue,
            ServiceAcceptTime = model.ServiceAcceptTime,
            ActualTime = model.ActualTime,
            MinuteOffset = model.MinuteOffset,
            SecondOffset = model.SecondOffset
        });
    }

    private IEnumerable<DangerAcceptedViewModel> MapEventDangerAccepted(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new DangerAcceptedViewModel
        {
            MatchId = model.MatchId,
            MatchCode = model.MatchCode,
            Name = GetMatchName(model),
            LeagueName = remotingRefService.GetLeagueName(model.SportType, model.LeagueId, LanguageCode.English),
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
            IsCheckedVar = model.IsCheckedVar,
            SportType = model.SportType,
            TvDetectionValue = model.TvDetectionValue,
            ServiceAcceptTime = model.ServiceAcceptTime,
            ActualTime = model.ActualTime,
            MinuteOffset = model.MinuteOffset,
            SecondOffset = model.SecondOffset
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
            LeagueName = remotingRefService.GetLeagueName(model.SportType, model.LeagueId, LanguageCode.English),
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
            LiveIndicator = model.LiveIndicator,
            SportType = model.SportType,
            FilterBetIdX = model.FilterBetIdX,
            FilterBetIdY = model.FilterBetIdY,
            FilterBetTypeId = model.FilterBetTypeId
        });
    }

    private IEnumerable<WrongOuViewModel> MapEventWrongOu(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new WrongOuViewModel
        {
            MatchId = model.MatchId,
            MatchCode = model.MatchCode,
            PoolHouseCheckedBetTypes = model.PoolHouseCheckedBetTypes,
            IsLinkGroup1X2 = model.IsLinkGroup1X2,
            IsLinkGroupAIO = model.IsLinkGroupAIO,
            Name = GetMatchName(model),
            LeagueName = remotingRefService.GetLeagueName(model.SportType, model.LeagueId, LanguageCode.English),
            IsMainMatch = model.IsMainMatch,
            SubIssueTypeId = model.SubIssueTypeId,
            EventDate = model.EventDate,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            ActualMarket = model.ActualMarket,
            WrongMarket = model.WrongMarket,
            LiveIndicator = model.LiveIndicator,
            SportType = model.SportType,
            FilterBetIdX = model.FilterBetIdX,
            FilterBetIdY = model.FilterBetIdY,
            FilterBetTypeId = model.FilterBetTypeId
            //FilterBetIdX = "802",
            //FilterBetIdY = "03",
            //FilterBetTypeId = "9070"
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
            FilterFavoriteType = model.FilterFavoriteType,
            FavoriteValue = model.FavoriteValue,
            WrongOU = model.WrongOU,
            Spread = model.Spread,
            AllowanceRate = model.AllowanceRate,
            CorrectOddsHomeOver = model.CorrectOddsHomeOver,
            CorrectOddsAwayUnder = model.CorrectOddsAwayUnder,
            FromOddsNotVoidHomeOver = model.FromOddsNotVoidHomeOver,
            ToOddsNotVoidHomeOver = model.ToOddsNotVoidHomeOver,
            FromOddsNotVoidAwayUnder = model.FromOddsNotVoidAwayUnder,
            ToOddsNotVoidAwayUnder = model.ToOddsNotVoidAwayUnder,
            SportType = model.SportType
        });
    }

    private static IEnumerable<NotParticipateViewModel> MapEventNotParticipate(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new NotParticipateViewModel
        {
            EventDate = model.EventDate,
            MatchId = model.MatchId,
            SubIssueTypeId = model.SubIssueTypeId,
            PlayerId = model.PlayerId,
            BetTypeIds = model.BetTypeIds
        });
    }

    private static IEnumerable<ReducedOverViewModel> MapEventReducedOver(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new ReducedOverViewModel
        {
            EventDate = model.EventDate,
            MatchId = model.MatchId,
            SubIssueTypeId = model.SubIssueTypeId,
            BetTypeIds = model.BetTypeIds,
            WicketOver = model.WicketOver,
            PlayerIds = model.PlayerIds,
            Runs = model.Runs,
            Live = model.Live,
            NonLive = model.NonLive
        });
    }

    private IEnumerable<EarlyKickOffViewModel> MapEventEarlyKickOff(IEnumerable<RequestEventModel> requestEventModels)
    {
        return requestEventModels.Select(model => new EarlyKickOffViewModel
        {
            MatchId = model.MatchId,
            MatchCode = model.MatchCode,
            Name = GetMatchName(model),
            LeagueName = remotingRefService.GetLeagueName(model.SportType, model.LeagueId, LanguageCode.English),
            IsMainMatch = model.IsMainMatch,
            SubIssueTypeId = model.SubIssueTypeId,
            EventDate = model.EventDate,
            KickOffTime = model.KickOffTime,
            Match = GetMatchModel(model),
            SportType = model.SportType
        });
    }

    private DuplicateTicketsViewModel MapEventDuplicateTickets(IEnumerable<RequestEventModel> requestEventModels)
    {
        var model = requestEventModels.First();
        return new DuplicateTicketsViewModel
        {
            TransIds = model.TransIds,
            OrgTransIds = model.OrgTransIds,
            MatchId = model.MatchId,
            FilterBy = model.FilterBy,
            SubIssueTypeId = model.SubIssueTypeId,
            SportType = model.SportType
        };
    }

    private static AbnormalAccountViewModel MapEventAbnormalAccount(IEnumerable<RequestEventModel> requestEventModels)
    {
        var model = requestEventModels.First();
        return new AbnormalAccountViewModel
        {
            Usernames = model.Usernames,
            ProductIds = model.ProductIds,
            StatusIds = model.StatusIds,
            FromDate = model.FromDate,
            ToDate = model.ToDate,
            SubIssueTypeId = model.SubIssueTypeId
        };
    }

    private static RecoverTicketViewModel MapEventRecoverTicket(IEnumerable<RequestEventModel> requestEventModels)
    {
        var model = requestEventModels.First();
        return new RecoverTicketViewModel
        {
            TransIds = model.TransIds,
            FilterBy = model.FilterBy,
            ProductIds = model.ProductIds,
            SubIssueTypeId = model.SubIssueTypeId
        };
    }

    private AbnormalBetViewModel MapEventAbnormalBet(IEnumerable<RequestEventModel> requestEventModels)
    {
        var firstModel = requestEventModels.First();
        var matches = requestEventModels.Select(x => new MatchInfoAddRequest
        {
            MatchId = x.MatchId,
            HomeId = x.HomeId,
            AwayId = x.AwayId,
            LeagueId = x.LeagueId,
            MatchCode = x.MatchCode,
            Name = GetMatchName(x),
            LeagueName = remotingRefService.GetLeagueName(x.SportType, x.LeagueId, LanguageCode.English)
        });
        return new AbnormalBetViewModel
        {
            TransIds = firstModel.TransIds,
            FilterBy = firstModel.FilterBy,
            SubIssueTypeId = firstModel.SubIssueTypeId,
            Matches = matches
        };
    }

    private async Task<IEnumerable<WrongMarketOfferedViewModel>> MapEventWrongMarketOffered(IEnumerable<RequestEventModel> requestEventModels)
    {
        var firstModel = requestEventModels.First();
        var betTypesAdvancedMode = advancedModeService.GetBetTypesAdvancedMode(firstModel.AdvancedExtraInfo);
        var groupBetTypes = await advancedModeService.GetGroupBetTypes(firstModel.MatchId,
            string.Join(",", betTypesAdvancedMode.Select(x => x.Id)));
        var allBetTypesSelection = advancedModeService.GetAllBetTypesSelection(firstModel.AllBetTypesSelectionJson);

        return requestEventModels.Select((model, index) => new WrongMarketOfferedViewModel
        {
            Id = index + 1,
            RequestDetailId = model.RequestDetailId,
            MatchId = model.MatchId,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            SubIssueTypeId = model.SubIssueTypeId,
            BetTeamsResult = betTypesAdvancedMode,
            GroupBetTypes = groupBetTypes,
            AllBetTypesSelection = allBetTypesSelection
        });
    }

    private async Task<WrongOddsSportsBookViewModel> MapEventWrongOddsSportsBook(IEnumerable<RequestEventModel> requestEventModels)
    {
        var model = requestEventModels.First();
        var betTypesAdvancedMode = advancedModeService.GetBetTypesAdvancedMode(model.AdvancedExtraInfo);
        var groupBetTypes = await advancedModeService.GetGroupBetTypes(model.MatchId,
            string.Join(",", betTypesAdvancedMode.Select(x => x.Id)));
        var allBetTypesSelection = advancedModeService.GetAllBetTypesSelection(model.AllBetTypesSelectionJson);

        return new WrongOddsSportsBookViewModel
        {
            MatchId = model.MatchId,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            SubIssueTypeId = model.SubIssueTypeId,
            LiveIndicator = model.LiveIndicator,
            FilterOddsType = model.FilterOddsType,
            OddsValue = model.OddsValue,
            FromOdds = model.FromOdds,
            ToOdds = model.ToOdds,
            CorrectOdds = model.CorrectOdds,
            BetTeamsResult = betTypesAdvancedMode,
            GroupBetTypes = groupBetTypes,
            AllBetTypesSelection = allBetTypesSelection
        };
    }

    private WrongOfferedNameViewModel MapEventWrongOfferedName(IEnumerable<RequestEventModel> requestEventModels)
    {
        var model = requestEventModels.First();
        return new WrongOfferedNameViewModel
        {
            MatchId = model.MatchId,
            SubIssueTypeId = model.SubIssueTypeId,
            CurrencyIds = model.CurrencyIds,
            LicenseeNames = model.LicenseeNames,
            Match = GetMatchModel(model),
            WrongName = model.WrongName,
            ActualName = model.ActualName,
            WrongNameT = model.WrongNameT,
            ActualNameT = model.ActualNameT,
            WrongNameS = model.WrongNameS,
            ActualNameS = model.ActualNameS
        };
    }

    private async Task<OtherIssuesViewModel> MapEventOtherIssues(IEnumerable<RequestEventModel> requestEventModels)
    {
        var model = requestEventModels.First();
        var betTypesAdvancedMode = advancedModeService.GetBetTypesAdvancedMode(model.AdvancedExtraInfo);
        var groupBetTypes = await advancedModeService.GetGroupBetTypes(model.MatchId,
            string.Join(",", betTypesAdvancedMode.Select(x => x.Id)));
        var allBetTypesSelection = advancedModeService.GetAllBetTypesSelection(model.AllBetTypesSelectionJson);

        return new OtherIssuesViewModel
        {
            MatchId = model.MatchId,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            SubIssueTypeId = model.SubIssueTypeId,
            BetTeamsResult = betTypesAdvancedMode,
            GroupBetTypes = groupBetTypes,
            AllBetTypesSelection = allBetTypesSelection
        };
    }

    private async Task<TechnicalErrorViewModel> MapEventTechnicalError(IEnumerable<RequestEventModel> requestEventModels)
    {
        var model = requestEventModels.First();
        var betTypesAdvancedMode = advancedModeService.GetBetTypesAdvancedMode(model.AdvancedExtraInfo);
        var groupBetTypes = await advancedModeService.GetGroupBetTypes(model.MatchId,
            string.Join(",", betTypesAdvancedMode.Select(x => x.Id)));
        var allBetTypesSelection = advancedModeService.GetAllBetTypesSelection(model.AllBetTypesSelectionJson);

        return new TechnicalErrorViewModel
        {
            MatchId = model.MatchId,
            FilterFromTransTime = model.FilterFromTransTime,
            FilterToTransTime = model.FilterToTransTime,
            VoidFromTime = model.VoidFromTime,
            VoidToTime = model.VoidToTime,
            SubIssueTypeId = model.SubIssueTypeId,
            BetTeamsResult = betTypesAdvancedMode,
            GroupBetTypes = groupBetTypes,
            AllBetTypesSelection = allBetTypesSelection
        };
    }

    private Match GetMatchModel(RequestEventModel eventModel)
    {
        var match = mapper.Map<Match>(eventModel);
        return matchService.UpdateMatchInfoFromRemotingRef(match);
    }

    private string GetMatchName(RequestEventModel requestEventModel)
    {
        var homeName = requestEventModel.IsNeutral
            ? remotingRefService.GetTeamName(requestEventModel.SportType, requestEventModel.HomeId, LanguageCode.English) + " (N)"
            : remotingRefService.GetTeamName(requestEventModel.SportType, requestEventModel.HomeId, LanguageCode.English);
        var awayName = remotingRefService.GetTeamName(requestEventModel.SportType, requestEventModel.AwayId, LanguageCode.English);

        return $"{requestEventModel.MatchId} - {homeName} - vs - {awayName}";
    }
}