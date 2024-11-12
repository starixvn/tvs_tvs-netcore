using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;

public interface SendEmailDuplicateTicketsService
{
    Task<IEnumerable<Result>> SendEmail(EmailVoidModel model);
}

public class SendEmailDuplicateTicketsServiceImp(
    SitesEmailService sitesEmailService,
    DuplicateTicketsEmailLicenseeService emailLicenseeService,
    DuplicateTicketsEmailItQaService emailItQaService,
    DuplicateTicketsEmailItSupportService emailItSupportService,
    IDynamicRepository repository,
    RemotingRefWrapperService remotingRefWrapperService)
    : SendEmailDuplicateTicketsService
{
    public async Task<IEnumerable<Result>> SendEmail(EmailVoidModel model)
    {
        var duplicateTickets = await GetDuplicateTickets(model.RequestId, model.VoidingHistoryId);
        var sites = await sitesEmailService.GetSitesByCategory(model.IssueTypeId);
        var viewModel = CreateMailViewModel(model);

        var results = await emailLicenseeService.Send(viewModel, sites, duplicateTickets);
        await emailItQaService.Send(viewModel, sites, duplicateTickets);
        await emailItSupportService.Send(viewModel, sites, duplicateTickets);

        return results;
    }

    private DuplicateTicketsMailVoidViewModel CreateMailViewModel(EmailVoidModel model)
    {
        return new DuplicateTicketsMailVoidViewModel
        {
            TemplatePath = TemplateEmailPath.DuplicateTicketsVoidBetChinese,
            SportType = GetSportTypeReplaceEmail(model.SportType),
            Message = model.Message
        };
    }

    private ContentByLanguageModel GetSportTypeReplaceEmail(int sportType)
    {
        return new ContentByLanguageModel
        {
            ContentEnglish = sportType > 0 ? remotingRefWrapperService.GetSportName(sportType.ToString(), LanguageCode.English) : "Mix Parlay",
            ContentChineseSimplified = sportType > 0 ? remotingRefWrapperService.GetSportName(sportType.ToString(), LanguageCode.ChineseSimplified) : "串关"
        };
    }

    public async Task<IEnumerable<DuplicateTicketsRequestInfo>> GetDuplicateTickets(int requestId, int voidingHistoryId)
    {
        var criteria = new DuplicateTicketsRequestInfoCriteria
        {
            RequestId = requestId,
            VoidingHistoryId = voidingHistoryId
        };

        return await repository.FetchAsync<DuplicateTicketsRequestInfo>(criteria);
    }
}