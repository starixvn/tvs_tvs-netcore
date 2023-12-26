using AutoMapper;
using SpecialDelete.RecoverBet.ViewModels;

namespace SpecialDelete.RecoverParlayBet;

public class RecoverParlayBetProfile : Profile
{
    public RecoverParlayBetProfile()
    {
        CreateMap<TicketViewModel, MailTicketViewModel>();
    }
}