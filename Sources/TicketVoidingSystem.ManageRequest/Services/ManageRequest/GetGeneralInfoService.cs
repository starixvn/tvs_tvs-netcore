using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetGeneralInfoService
{
    Task<GeneralInfoViewModel> GetGeneralInfoViewModel(GetGeneralInfoCriteria message);
}

public class GetGeneralInfoServiceImp(
    RemotingRefWrapperService remotingRefService,
    IDynamicRepository repository)
    : GetGeneralInfoService
{
    public async Task<GeneralInfoViewModel> GetGeneralInfoViewModel(GetGeneralInfoCriteria message)
    {
        var (sourceGeneralInfo, sourceUserVoidMessages, sourceEmailResults)
            = await repository.FetchMultipleAsync<GeneralInfoModel, UserVoidMessage, EmailResultModel>(message);
        var generalInfo = GetGeneralInfoModel(sourceGeneralInfo);
        var viewModel = new GeneralInfoViewModel
        {
            GeneralInfoModel = generalInfo,
            UserVoidMessages = sourceUserVoidMessages.GroupBy(x => x.VoidedBy)
                .Select(group => new GroupUserVoidMessage
                {
                    VoidedBy = group.Key,
                    Messages = group
                }),
            SucceedEmails = sourceEmailResults
                .Where(x => x.Type == VoidBetResultCode.SendEmailToLicenseeSuccess)
                .Select(x => x.Message).Distinct(),
            FailedEmails = sourceEmailResults
                .Where(x => x.Type == VoidBetResultCode.SendEmailToLicenseeFail)
                .Select(x => x.Message).Distinct()
        };

        return viewModel;
    }

    private GeneralInfoModel GetGeneralInfoModel(IEnumerable<GeneralInfoModel> generalInfoModel)
    {
        var generalInfo = generalInfoModel.FirstOrDefault() ?? new GeneralInfoModel();
        generalInfo.LeagueName = remotingRefService.GetLeagueName(generalInfo.SportType, generalInfo.LeagueId, LanguageCode.English);
        generalInfo.VoidedTimeString = generalInfo.VoidedTime.ZoneManila().ToString("dd/MM/yyyy - hh:mm:ss tt");
        generalInfo.RecoveredTimeString = generalInfo.RecoveredTime.ToString(FormatKey.LongDateFormatTimeWithSlash);
        generalInfo.KickOffTimeString = generalInfo.KickOffTime.ZoneManila().ToString("hh:mm tt");
        generalInfo.NegativeBalanceUsers = !string.IsNullOrWhiteSpace(generalInfo.NegativeBalanceUsers)
            ? string.Join(", ", generalInfo.NegativeBalanceUsers.Split(',')) : generalInfo.NegativeBalanceUsers;

        return generalInfo;
    }
}