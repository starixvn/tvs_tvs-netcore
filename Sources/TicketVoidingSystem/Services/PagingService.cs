using System;
using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services;

public interface PagingService
{
    IEnumerable<T> Paging<T>(in IEnumerable<T> tickets, int index, int size);

    IEnumerable<Group<T>> Groups<T>(in IEnumerable<T> tickets, Func<T, string> filter);
}

public class PagingServiceImp : PagingService
{
    public IEnumerable<T> Paging<T>(in IEnumerable<T> tickets, int index, int size)
    {
        var skip = index * size;
        return tickets.Skip(skip).Take(size);
    }

    public IEnumerable<Group<T>> Groups<T>(in IEnumerable<T> tickets, Func<T, string> filter)
    {
        var groups = tickets.GroupBy(filter);
        return groups.Select(group => new Group<T>
        {
            Name = group.Key,
            Tickets = group.Select(ticket => ticket).ToList()
        });
    }
}