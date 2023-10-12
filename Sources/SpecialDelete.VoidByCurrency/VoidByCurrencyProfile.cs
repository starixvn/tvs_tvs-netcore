using AutoMapper;
using Fanex.BetList.Core.Entities;
using SpecialDelete.VoidByCurrency.Criteria;
using SpecialDelete.VoidByCurrency.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VoidByCurrency;

public class VoidByCurrencyProfile : Profile
{
    public VoidByCurrencyProfile()
    {
        CreateMap<GetTicketModel, Ticket>();
        CreateMap<VoidTicketsQuery, VoidTicketsCriteria>();
        CreateMap<VoidTicketsQuery, EmailVoidModel>();
        CreateMap<VoidTicketsQuery, TicketInfoForLetstalk>();
    }
}