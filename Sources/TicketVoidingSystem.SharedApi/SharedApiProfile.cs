using AutoMapper;
using TicketVoidingSystem.SharedApi.Criteria.Permission;
using TicketVoidingSystem.SharedApi.Handlers.Permission;
using TicketVoidingSystem.SharedApi.Models.MessageTemplate;
using TicketVoidingSystem.SharedApi.ViewModels.MessageTemplate;

namespace TicketVoidingSystem.SharedApi;

public class SharedApiProfile : Profile
{
    public SharedApiProfile()
    {
        CreateMap<TemplateModel, MessageTemplateViewModel>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidByBetIdCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidSingleBetCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidParlayBetCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidByCurrencyCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionVoidCashOutTransactionCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckVoidBetPermissionTicketVoidingCriteria>();
        CreateMap<CheckTicketsStatusRequest, CheckPermissionMarkTicketsCriteria>();
    }
}