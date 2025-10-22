using AutoMapper;
using Fanex.BetList.Core.Entities;
using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.ViewModels;

namespace SpecialDelete.RecoverBet;

public class RecoverBetProfile : Profile
{
    public RecoverBetProfile()
    {
        CreateMap<GetTicketModel, Ticket>();
        CreateMap<TicketViewModel, MailTicketViewModel>();
    }
}