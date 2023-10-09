using AutoMapper;
using Fanex.BetList.Core.Entities;
using SpecialDelete.NumberGame.Criteria;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.ViewModels;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.NumberGame;

public class NumberGameProfile : Profile
{
    public NumberGameProfile()
    {
        CreateMap<GetTicketModel, Ticket>();
        CreateMap<TicketViewModel, ExcelTicketModel>();
        CreateMap<VoidTicketsQuery, EmailVoidModel>();
        CreateMap<VoidTicketsQuery, VoidTicketsCriteria>();
        CreateMap<GetVoidTicketsQuery, GetVoidTicketsCriteria>();
    }
}