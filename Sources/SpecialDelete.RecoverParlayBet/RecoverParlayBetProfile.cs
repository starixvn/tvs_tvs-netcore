namespace SpecialDelete.RecoverParlayBet
{
    using AutoMapper;
    using ViewModels;

    public class RecoverParlayBetProfile : Profile
    {
        public RecoverParlayBetProfile()
        {
            CreateMap<TicketViewModel, MailTicketViewModel>();
        }
    }
}