using AutoMapper;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.ViewModels;

namespace TicketVoidingSystem.VoidSingleBet;

public class VoidSingleBetProfile : Profile
{
    public VoidSingleBetProfile()
    {
        CreateMap<GetTicketsQuery, GetTicketsCriteria>();
        CreateMap<TicketViewModel, ExcelTicketModel>();
        CreateMap<GetTicketModel, Ticket>();
        CreateMap<VoidTicketsQuery, EmailVoidModel>();
        CreateMap<VoidTicketsQuery, TicketInfoForLetstalk>();
        CreateMap<VoidTicketsQuery, VoidTicketsCriteria>();
    }
}