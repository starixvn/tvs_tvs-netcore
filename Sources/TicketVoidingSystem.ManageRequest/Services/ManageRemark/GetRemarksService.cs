using TicketVoidingSystem.ManageRequest.Models.ManageRemark;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface GetRemarksService
{
    Task<IEnumerable<RemarkModel>> GetRemarks(SelectRemarksQuery query);
}

public class GetRemarksServiceImp(
    GetRemarksInActiveTableService getRemarksInActiveTableService,
    GetRemarksInArchivedTableService getRemarksInArchivedTableService)
    : GetRemarksService
{
    public async Task<IEnumerable<RemarkModel>> GetRemarks(SelectRemarksQuery query)
    {
        if (query.RemarkId != null || query.MatchId != null)
        {
            query.FromDate = null;
            query.ToDate = null;
            return await getRemarksInActiveTableService.GetRemarksInActiveTable(query);
        }
        if (query.IsFromDateBeforeBUDay == false)
        {
            return await HandleForActiveDataSearchByDate(query);
        }

        if (query.IsToDateBeforeBUDay == true)
        {
            return await HandleForArchivedDataSearchByDate(query);
        }

        var activeRemarks = await HandleForActiveDataSearchByDate(query);
        var archivedRemarks = await HandleForArchivedDataSearchByDate(query);

        return activeRemarks.Union(archivedRemarks).Distinct();
    }

    private async Task<IEnumerable<RemarkModel>> HandleForActiveDataSearchByDate(SelectRemarksQuery query)
    {
        if (query.IsFromDateBeforeBUDay == true)
        {
            query.FromDate = query.BUDay;
        }
        query.ToDate = query.ToDate;
        return await getRemarksInActiveTableService.GetRemarksInActiveTable(query);
    }

    private async Task<IEnumerable<RemarkModel>> HandleForArchivedDataSearchByDate(SelectRemarksQuery query)
    {
        query.FromDate = query.FromDate;
        if (query.IsToDateBeforeBUDay == false)
        {
            query.ToDate = query.BUDay;
        }
        return await getRemarksInArchivedTableService.GetRemarksInArchivedTable(query);
    }
}