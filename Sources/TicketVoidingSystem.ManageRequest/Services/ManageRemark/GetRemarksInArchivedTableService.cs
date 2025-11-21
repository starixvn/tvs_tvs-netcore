using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface GetRemarksInArchivedTableService
{
    Task<IEnumerable<RemarkModel>> GetRemarksInArchivedTable(SelectRemarksQuery query);
}

public class GetRemarksInArchivedTableServiceImp(
    IMapper mapper,
    IDynamicRepository repository)
    : GetRemarksInArchivedTableService
{
    public async Task<IEnumerable<RemarkModel>> GetRemarksInArchivedTable(SelectRemarksQuery query)
    {
        var criteriaArchived = mapper.Map<SelectArchivedRemarksCriteria>(query);
        criteriaArchived.FromDate = query.FromDate;
        if (query.IsToDateBeforeBUDay == false)
        {
            criteriaArchived.ToDate = query.BUDay;
        }

        return await repository.FetchAsync<RemarkModel>(criteriaArchived);
    }
}