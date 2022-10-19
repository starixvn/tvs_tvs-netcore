using System;
using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services
{
    public interface PagingService
    {
        IEnumerable<T> Paging<T>(IEnumerable<T> tickets, int index, int size);

        IEnumerable<Group<T>> Groups<T>(IEnumerable<T> tickets, Func<T, string> filter);

        IEnumerable<Group<T>> PagingGroups<T>(IEnumerable<Group<T>> groups, int pageIndex, int pageSize);
    }

    public class PagingServiceImp : PagingService
    {
        public IEnumerable<T> Paging<T>(IEnumerable<T> tickets, int index, int size)
        {
            var skip = index * size;
            return tickets.Skip(skip).Take(size);
        }

        public IEnumerable<Group<T>> Groups<T>(IEnumerable<T> tickets, Func<T, string> filter)
        {
            var groups = tickets.GroupBy(filter);
            return groups.Select(group => new Group<T>
            {
                Name = group.Key,
                Tickets = group.Select(ticket => ticket).ToList()
            });
        }

        public IEnumerable<Group<T>> PagingGroups<T>(IEnumerable<Group<T>> groups, int pageIndex, int pageSize)
        {
            var skip = pageIndex * pageSize;
            var allTickets = groups.Select(groupTicket =>
                    groupTicket.Tickets
                        .Select(ticket => new
                        {
                            groupTicket.Name,
                            Tickets = ticket
                        }))
                .SelectMany(tickets => tickets);

            var ticketGroupAfterSkip = allTickets.Skip(skip)
                .Take(pageSize)
                .GroupBy(
                    ticket => ticket.Name,
                    ticket => ticket.Tickets,
                    (groupName, groupTicket) => new Group<T>
                    {
                        Name = groupName,
                        Tickets = groupTicket.ToList()
                    })
                .ToList();

            return ticketGroupAfterSkip;
        }
    }
}