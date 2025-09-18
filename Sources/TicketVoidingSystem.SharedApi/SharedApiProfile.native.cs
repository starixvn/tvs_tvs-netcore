using AutoMapper;
using TicketVoidingSystem.SharedApi.Criteria.Permission;
using TicketVoidingSystem.SharedApi.Handlers.Permission;

namespace TicketVoidingSystem.SharedApi;

public class SharedApiProfile : Profile
{
    public SharedApiProfile()
    {
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidByBetIdCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidSingleBetCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidParlayBetCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidByCurrencyCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidCashOutTransactionCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionTicketVoidingCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckPermissionMarkTicketsCriteria>();
    }
}