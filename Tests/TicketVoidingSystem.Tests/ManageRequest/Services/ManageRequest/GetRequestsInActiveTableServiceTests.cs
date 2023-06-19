using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest
{
    public class GetRequestsInActiveTableServiceTests
    {
        private readonly BetListService betListService;
        private readonly IDynamicRepository repository;
        private readonly IMapper mapper;

        private readonly WrongScoreInfoService wrongScoreInfoService;
        private readonly GetRequestsInActiveTableServiceImp service;

        public GetRequestsInActiveTableServiceTests()
        {
            betListService = Substitute.For<BetListService>();
            repository = Substitute.For<IDynamicRepository>();
            mapper = Substitute.For<IMapper>();
            service = new GetRequestsInActiveTableServiceImp(repository, mapper, betListService);
        }

        
    }
}