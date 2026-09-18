using ComponentPlatform.Contracts.Pagination;

namespace ComponentPlatform.Domain.Customers;

public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<Customer>> GetPagedAsync(PagedRequest request, CancellationToken cancellationToken = default);
    Task AddAsync(Customer customer, CancellationToken cancellationToken = default);
    void Update(Customer customer);
    void Remove(Customer customer);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
