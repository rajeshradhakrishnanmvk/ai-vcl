using ComponentPlatform.Contracts.Customers;
using ComponentPlatform.Contracts.Pagination;
using ComponentPlatform.Domain.Customers;

namespace ComponentPlatform.Application.Customers;

public interface ICustomerService
{
    Task<CustomerDto> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default);
    Task<CustomerDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<CustomerDto>> GetPagedAsync(PagedRequest request, CancellationToken cancellationToken = default);
    Task<CustomerDto> UpdateAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed class CustomerService(ICustomerRepository repository) : ICustomerService
{
    public async Task<CustomerDto> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var customer = Customer.Create(request.Name, request.Email, request.Phone);
        await repository.AddAsync(customer, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);
        return MapToDto(customer);
    }

    public async Task<CustomerDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await repository.GetByIdAsync(id, cancellationToken);
        return customer is null ? null : MapToDto(customer);
    }

    public async Task<PagedResult<CustomerDto>> GetPagedAsync(PagedRequest request, CancellationToken cancellationToken = default)
    {
        var result = await repository.GetPagedAsync(request, cancellationToken);
        var dtos = result.Items.Select(MapToDto).ToList().AsReadOnly();
        return new PagedResult<CustomerDto>(dtos, result.TotalCount, result.Page, result.PageSize);
    }

    public async Task<CustomerDto> UpdateAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var customer = await repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Customer {id} not found.");
        customer.Update(request.Name, request.Email, request.Phone);
        repository.Update(customer);
        await repository.SaveChangesAsync(cancellationToken);
        return MapToDto(customer);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Customer {id} not found.");
        repository.Remove(customer);
        await repository.SaveChangesAsync(cancellationToken);
    }

    private static CustomerDto MapToDto(Customer c) =>
        new(c.Id, c.Name, c.Email, c.Phone, c.CreatedAt);
}
