using AutoMapper;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing;

public class TicketListingProfile : Profile
{
    public TicketListingProfile()
    {
        CreateMap<DetailTicketModel, Ticket>();
        CreateMap<GetTicketsDetailCriteria, GetTicketExcelOicCriteria>();
        CreateMap<GetSummaryQuery, GetSummaryCriteria>();
        CreateMap<GetDetailQuery, GetTicketsDetailCriteria>();
    }
}