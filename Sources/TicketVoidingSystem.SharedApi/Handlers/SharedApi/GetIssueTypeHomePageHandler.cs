using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetIssueTypeHomePageRequest : IRequest<IEnumerable<IssueTypeHomePageModel>>
{
    public string IssueTypeIds { get; set; }
}

public class GetIssueTypeHomePageHandler(IDynamicRepository repository)
    : IRequestHandler<GetIssueTypeHomePageRequest, IEnumerable<IssueTypeHomePageModel>>
{
    public async Task<IEnumerable<IssueTypeHomePageModel>> Handle(GetIssueTypeHomePageRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var (fromDate, toDate) = GetCurrentMonthDateRange();

            var activeResults = await GetActiveResults(fromDate, toDate, request.IssueTypeIds);

            var result = activeResults.IsScanArchiveRange
                ? await GetCombinedResults(activeResults.Data, fromDate, toDate, request.IssueTypeIds)
                : activeResults.Data.OrderBy(x => x.IssueTypeId).ToList();

            return result;
        }
        catch (Exception e)
        {
            return [];
        }

    }

    private async Task<(IEnumerable<IssueTypeHomePageModel> Data, bool IsScanArchiveRange)> GetActiveResults(DateTime fromDate, DateTime toDate, string issueTypeIds)
    {
        var activeCriteria = new GetTotalRequestByIssueTypeActive
        {
            IssueTypeIds = issueTypeIds,
            FromDate = fromDate,
            ToDate = toDate
        };

        var activeResults = await repository.FetchAsync<IssueTypeHomePageModel>(activeCriteria);
        return (activeResults, activeCriteria.IsScanArchiveRange);
    }

    private async Task<List<IssueTypeHomePageModel>> GetCombinedResults(IEnumerable<IssueTypeHomePageModel> activeResults, DateTime fromDate, DateTime toDate, string issueTypeIds)
    {
        var archiveResults = await GetArchiveResults(fromDate, toDate, issueTypeIds);

        return activeResults.Concat(archiveResults)
            .GroupBy(x => x.IssueTypeId)
            .Select(g => new IssueTypeHomePageModel
            {
                IssueTypeId = g.Key,
                TotalRequest = g.Sum(x => x.TotalRequest)
            })
            .OrderBy(x => x.IssueTypeId)
            .ToList();
    }

    private async Task<IEnumerable<IssueTypeHomePageModel>> GetArchiveResults(DateTime fromDate, DateTime toDate, string issueTypeIds)
    {
        var archiveCriteria = new GetTotalRequestByIssueTypeArchive
        {
            IssueTypeIds = issueTypeIds,
            FromDate = fromDate,
            ToDate = toDate
        };

        return await repository.FetchAsync<IssueTypeHomePageModel>(archiveCriteria);
    }

    private static (DateTime fromDate, DateTime toDate) GetCurrentMonthDateRange()
    {
        var now = DateTimeOffset.Now;
        var fromDate = new DateTimeOffset(now.Year, now.Month, 1, 0, 0, 0, now.Offset);

        return (fromDate.DateTime, now.DateTime);
    }
}