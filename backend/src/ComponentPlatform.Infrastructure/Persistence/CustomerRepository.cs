using ComponentPlatform.Contracts.Pagination;
using ComponentPlatform.Domain.Customers;
using Microsoft.EntityFrameworkCore;

namespace ComponentPlatform.Infrastructure.Persistence;

public sealed class CustomerRepository(AppDbContext context) : ICustomerRepository
{
    public async Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await context.Customers.FindAsync([id], cancellationToken);

    public async Task<PagedResult<Customer>> GetPagedAsync(PagedRequest request, CancellationToken cancellationToken = default)
    {
        var query = context.Customers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Filter))
            query = query.Where(c => c.Name.Contains(request.Filter) || c.Email.Contains(request.Filter));

        if (!string.IsNullOrWhiteSpace(request.Sort))
        {
            query = request.Sort.ToLowerInvariant() switch
            {
                "name" => query.OrderBy(c => c.Name),
                "name_desc" => query.OrderByDescending(c => c.Name),
                "email" => query.OrderBy(c => c.Email),
                _ => query.OrderBy(c => c.CreatedAt)
            };
        }
        else
        {
            query = query.OrderBy(c => c.CreatedAt);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Customer>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task AddAsync(Customer customer, CancellationToken cancellationToken = default)
        => await context.Customers.AddAsync(customer, cancellationToken);

    public void Update(Customer customer)
        => context.Customers.Update(customer);

    public void Remove(Customer customer)
        => context.Customers.Remove(customer);

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => context.SaveChangesAsync(cancellationToken);
}
