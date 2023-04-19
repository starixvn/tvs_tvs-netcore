using AutoMapper;
using TicketVoidingSystem.SharedApi.Models.MessageTemplate;
using TicketVoidingSystem.SharedApi.ViewModels.MessageTemplate;

namespace TicketVoidingSystem.SharedApi;

public class SharedApiProfile : Profile
{
    public SharedApiProfile()
    {
        CreateMap<TemplateModel, MessageTemplateViewModel>();
    }
}