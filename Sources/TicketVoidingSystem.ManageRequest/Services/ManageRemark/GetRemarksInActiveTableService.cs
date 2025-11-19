using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface GetRemarksInActiveTableService
{
    Task<IEnumerable<RemarkModel>> GetRemarksInActiveTable(SelectRemarksQuery query);
}

public class GetRemarksInActiveTableServiceImp(IMapper mapper, IDynamicRepository repository)
    : GetRemarksInActiveTableService
{
    public async Task<IEnumerable<RemarkModel>> GetRemarksInActiveTable(SelectRemarksQuery query)
    {
        var criteriaActive = mapper.Map<SelectActiveRemarksCriteria>(query);
        return await repository.FetchAsync<RemarkModel>(criteriaActive);
    }
}

