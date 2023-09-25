using AutoMapper;
using Fanex.BetList.Core.Entities;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.VoidParlaySub.Criteria;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VirtualSports;

public class VirtualSportsProfile : Profile
{
    public VirtualSportsProfile()
    {
        CreateMap<GetTicketModel, Ticket>();
        //  CreateMap<Query, GetTicketsCriteria>();
        CreateMap<VoidTicketsQuery, VoidTicketsCriteria>();
        CreateMap<TicketViewModel, MailTicketViewModel>();
        CreateMap<VoidTicketsQuery, EmailVoidModel>();
        // CreateMap<VoidTicketsQuery, MessageQuery>();
    }
}